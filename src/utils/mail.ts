import sgMail from '@sendgrid/mail'
import { createLogger } from '@subsquid/logger'

const mailerLogger = createLogger('mailer')

if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
  mailerLogger.info('Sendgrid API initialized using SENDGRID_API_KEY')
} else {
  mailerLogger.warn('SENDGRID_API_KEY not set, running in debug-only mode...')
}

type SendMailArgs = {
  from: string
  to: string
  subject: string
  content: string
}

export async function sgSendMail({ from, to, subject, content }: SendMailArgs) {
  if (!process.env.SENDGRID_API_KEY) {
    mailerLogger.info(
      `Skipped sending e-mail:\n${JSON.stringify({ from, to, subject, content }, null, 2)}`
    )
    return
  }
  const [clientResponse] = await sgMail.send({
    from,
    to,
    subject,
    html: content,
  })
  // mailerLogger.info(`E-mail sent:\n${JSON.stringify({ from, to, subject, content }, null, 2)}`)

  return clientResponse
}
