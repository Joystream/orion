import fs from 'fs'
import AsyncLock from 'async-lock'

export class PersistentQueue<T> {
  private queue: T[] = []
  private writeStream: fs.WriteStream | null = null
  private initialized = false
  private asyncLock = new AsyncLock({ maxPending: Number.MAX_SAFE_INTEGER })
  filepath = ''

  constructor(filepath: string) {
    this.filepath = filepath
    this.queue = []
    this.loadQueue()
    this.writeStream = fs.createWriteStream(this.filepath, { flags: 'a' })
    this.initialized = true
  }

  loadQueue() {
    try {
      if (!fs.existsSync(this.filepath)) {
        return
      }
      const data = fs.readFileSync(this.filepath, { encoding: 'utf-8' })
      this.queue = JSON.parse(`[${data.split('\n').slice(0, -1).join(',')}]`)
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
        console.error('Failed to load queue:', error)
      }
    }
  }

  lockQueue(cb: () => Promise<void>) {
    return this.asyncLock.acquire(
      this.filepath,
      async (done) => {
        await cb()
        done()
      },
      { skipQueue: true }
    )
  }

  flushQueue() {
    return this.asyncLock.acquire(
      this.filepath,
      async (done) => {
        this.writeStream?.end()
        fs.truncate(this.filepath, 0, (err) => {
          if (err) {
            done()
            throw err
          }
          this.queue = []
          this.writeStream = fs.createWriteStream(this.filepath, { flags: 'a' })
          done()
        })
      },
      { skipQueue: true }
    )
  }

  async addToQueue(item: T) {
    if (!this.initialized) {
      return
    }
    await this.writeItemToFile(item)
    this.queue.push(item)
  }

  writeItemToFile(item: T) {
    return this.asyncLock.acquire(this.filepath, async (done) => {
      const dataToWrite = JSON.stringify(item).trim().replace('\n', '') + '\n'
      this.writeStream?.write(dataToWrite, 'utf8', (err) => {
        if (err) {
          done()
          throw err
        } else {
          done()
        }
      })
    })
  }

  getQueue() {
    return this.queue
  }
}
