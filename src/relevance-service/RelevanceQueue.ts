import amqp from 'amqplib'
import { createLogger, Logger } from '@subsquid/logger'

export const CHANNELS_QUEUE_NAME = 'orion.relevance.channels'
export const RESTART_QUEUE_NAME = 'orion.relevance.restart'

export async function initChannel() {
  const url = process.env.RABBITMQ_URL || 'amqp://localhost'
  const conn = await amqp.connect(url)
  const channel = await conn.createConfirmChannel()
  await channel.assertQueue(CHANNELS_QUEUE_NAME, {
    durable: true,
  })
  await channel.assertQueue(RESTART_QUEUE_NAME, {
    durable: false,
    maxLength: 1,
    autoDelete: true,
  })
  return channel
}

type PushOptions = {
  deferred?: boolean
  skipIfUninitialized?: boolean
}

type RelevancePublisherConfig = {
  autoInitialize: boolean
  defaultPushOptions: PushOptions
}

export class RelevanceQueuePublisher {
  protected logger: Logger = createLogger('relevance-queue:publisher')
  protected deferredChannelIds: Set<string> = new Set()
  protected autoInitialize: boolean
  protected deferredRestart = false
  protected defaultPushOptions: Required<PushOptions>
  protected _channel: amqp.ConfirmChannel

  constructor(config?: RelevancePublisherConfig) {
    this.autoInitialize = config?.autoInitialize || false
    this.defaultPushOptions = {
      deferred: false,
      skipIfUninitialized: false,
      ...(config?.defaultPushOptions || {}),
    }
  }

  protected get channel() {
    if (!this._channel) {
      throw new Error('RelevanceQueuePublisher is not initialized. Call init() first.')
    }
    return this._channel
  }

  public get initialized() {
    return !!this._channel
  }

  public async init() {
    if (!this._channel) {
      this._channel = await initChannel()
    } else {
      this.logger.warn('RelevanceQueuePublisher is already initialized.')
    }
  }

  protected parseOptions(options?: PushOptions) {
    return {
      ...this.defaultPushOptions,
      ...(options || {}),
    }
  }

  public async pushRestartRequest(options?: PushOptions) {
    options = this.parseOptions(options)
    if (!this.initialized && options.skipIfUninitialized) {
      return
    }
    if (options.deferred) {
      this.deferredRestart = true
    } else {
      await this.queueRestart()
    }
  }

  public async pushChannel(channelId?: string | null, options?: PushOptions) {
    options = this.parseOptions(options)
    if (!channelId || (!this.initialized && options.skipIfUninitialized)) {
      return
    }
    if (options.deferred) {
      this.deferredChannelIds.add(channelId)
    } else {
      await this.queueChannel(channelId)
    }
  }

  public async commitDeferred(): Promise<void> {
    if (this.deferredChannelIds.size) {
      const deferredChannelIds = [...this.deferredChannelIds]
      this.deferredChannelIds.clear()
      const results = await Promise.all(
        deferredChannelIds.map((channelId) => this.queueChannel(channelId))
      )
      const [successCount, totalCount] = [
        results.filter((result) => result === true).length,
        results.length,
      ]
      this.logger.info(
        `Committed ${successCount} / ${totalCount} deferred messages to relevance recalc queue.`
      )
    }
    if (this.deferredRestart) {
      this.deferredRestart = false
      const result = await this.queueRestart()
      if (result === true) {
        this.logger.info(`Comitted a deferred restart`)
      }
    }
  }

  protected async sendMessage(
    queue: string,
    message: Buffer,
    options?: amqp.Options.Publish
  ): Promise<true | string> {
    if (!this.initialized && this.autoInitialize) {
      await this.init()
    }
    return new Promise((resolve) => {
      this.channel.sendToQueue(
        queue,
        message,
        {
          ...options,
        },
        (err) => {
          if (err) {
            this.logger.error(err, `Failed to send message to queue "${queue}"!`)
            resolve(err instanceof Error ? err.message : String(err))
          } else {
            this.logger.debug(`Message sent to queue "${queue}". Content: ${message.toString()}`)
            resolve(true)
          }
        }
      )
    })
  }

  protected queueChannel(channelId: string): Promise<true | string> {
    return this.sendMessage(CHANNELS_QUEUE_NAME, Buffer.from(channelId), {
      persistent: true,
      contentType: 'text/plain',
    })
  }

  protected queueRestart(): Promise<true | string> {
    return this.sendMessage(RESTART_QUEUE_NAME, Buffer.from([1]))
  }
}

export type ChannelIdsBatch = {
  channelIds: string[]
  ack?: () => void
}

type RelevanceConsumerConfig = {
  onRestartSignal: () => void
}

export class RelevanceQueueConsumer {
  protected logger: Logger = createLogger('relevance-queue:consumer')

  protected constructor(protected channel: amqp.ConfirmChannel) {}

  public static async init({ onRestartSignal }: RelevanceConsumerConfig) {
    const channel = await initChannel()
    await channel.consume(
      RESTART_QUEUE_NAME,
      (msg) => {
        if (msg?.content) {
          channel.ack(msg)
          onRestartSignal()
        }
      },
      { noAck: false }
    )
    return new RelevanceQueueConsumer(channel)
  }

  public async channelsQueueSize(): Promise<number> {
    const { messageCount } = await this.channel.checkQueue(CHANNELS_QUEUE_NAME)
    return messageCount
  }

  public async getChannelsBatch(size: number): Promise<ChannelIdsBatch> {
    const batch: Set<string> = new Set()
    let lastMessage: amqp.GetMessage | null = null
    let msg: amqp.GetMessage | false = false
    while (
      batch.size < size &&
      (msg = await this.channel.get(CHANNELS_QUEUE_NAME, { noAck: false }))
    ) {
      lastMessage = msg
      const channelId = msg.content.toString()
      if (!batch.has(channelId)) {
        batch.add(channelId)
      }
    }
    return {
      channelIds: Array.from(batch),
      ack: () => lastMessage && this.channel.ack(lastMessage, true),
    }
  }
}
