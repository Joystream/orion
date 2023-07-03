import sgMail from '@sendgrid/mail'
import { createLogger } from '@subsquid/logger'
import { ChannelPaymentMadeEventData, CommentCreatedEventData, EventData } from '../model'

type SendMailArgs = {
  from: string
  to: string
  subject: string
  content: string
}

// create a strategy interface with a send mail method
export interface SendMailStrategy {
  sendMail({ from, to, subject, content }: SendMailArgs): Promise<void> // statuscode
  mailHasBeenSent(): boolean
}

export class MailNotifier {
  protected _sendMailStrategy: SendMailStrategy
  protected _senderMail: string = ''
  protected _recieverMail: string = ''
  protected _content: string = ''
  protected _subject: string = ''

  public setSendMailSTrategy(strategy: SendMailStrategy) {
    this._sendMailStrategy = strategy
  }

  constructor() {
    this._sendMailStrategy = new DefaultSendMailStrategy()
  }

  public setSubject(subject: string) {
    this._subject = subject
  }

  public setSender(sender: string) {
    this._senderMail = sender
  }

  public setReciever(reciever: string) {
    this._recieverMail = reciever
  }

  public setContentUsingTemplate(notificationData: any) {
    this._content = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Template</title>
      </head>
      <body>
        <div>
          <p>Hi ${notificationData.user},</p>
          <p>This is a notification email regarding the following subject: ${notificationData.subject}.</p>
          <p>Timestamp: ${notificationData.timestamp}</p>
        </div>
      </body>
      </html>
      `
  }

  public async send(): Promise<void> {
    return await this._sendMailStrategy.sendMail({
      from: this._senderMail,
      to: this._recieverMail,
      subject: this._subject,
      content: this._content,
    })
  }

  public mailHasBeenSent(): boolean {
    return this._sendMailStrategy.mailHasBeenSent()
  }
}

/** sample usage
 * const mailNotifier = new MailNotifier()
 * mailNotifier.setSender("sender@gmail.com")
 * mailNotifier.setReciever("receiver@gmail.com")
 * mailNotifier.setContentUsingTemplate({...})
 * mailNotifier.setSubject("")
 * mailNotifer.setSendMailSTrategy(new SendGridMailStrategy())
 * await mailNotifier.send()
 */

const mailerLogger = createLogger('mailer')

export class SendGridMailStrategy implements SendMailStrategy {
  protected _result: sgMail.ClientResponse
  public init() {
    if (process.env.SENDGRID_API_KEY) {
      sgMail.setApiKey(process.env.SENDGRID_API_KEY)
      mailerLogger.info('Sendgrid API initialized using SENDGRID_API_KEY')
    } else {
      mailerLogger.warn('SENDGRID_API_KEY not set, running in debug-only mode...')
    }
  }

  mailHasBeenSent(): boolean {
    return this._result.statusCode === 202
  }

  async sendMail({ from, to, subject, content }: SendMailArgs): Promise<void> {
    if (!process.env.SENDGRID_API_KEY) {
      mailerLogger.info(
        `Skipped sending e - mail: \n${JSON.stringify({ from, to, subject, content }, null, 2)} `
      )
      return
    }
    this._result = (
      await sgMail.send({
        from,
        to,
        subject,
        html: content,
      })
    )[0]
    mailerLogger.info(
      `E - mail sent: \n${JSON.stringify({ from, to, subject, content }, null, 2)} `
    )
    console.log(`------------> MAIL SENT !!!!!!!!`)
  }
}

class DefaultSendMailStrategy extends SendGridMailStrategy {
  async sendMail({ from, to, subject, content }: SendMailArgs): Promise<void> {}

  mailHasBeenSent(): boolean {
    return false
  }
}
