import sgMail from '@sendgrid/mail'
import { createLogger } from '@subsquid/logger'
import { ChannelPaymentMadeEventData, CommentCreatedEventData, EventData } from '../model'

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

export async function sendMail({ from, to, subject, content }: SendMailArgs) {
  if (!process.env.SENDGRID_API_KEY) {
    mailerLogger.info(
      `Skipped sending e-mail:\n${JSON.stringify({ from, to, subject, content }, null, 2)}`
    )
    return
  }
  await sgMail.send({
    from,
    to,
    subject,
    html: content,
  })
  mailerLogger.info(`E-mail sent:\n${JSON.stringify({ from, to, subject, content }, null, 2)}`)
}


export function emailNotificationTemplate(event: EventData): string {
  // the return type can be a template that is combined with event data in a function
  switch (event.isTypeOf) {
    case 'CommentCreatedEventData': return "commentCreatedTemplateWith(event.data)"
    case 'CommentTextUpdatedEventData': return ""
    case 'OpenAuctionStartedEventData': return ""
    case 'EnglishAuctionStartedEventData': return ""
    case 'NftIssuedEventData': return ""
    case 'AuctionBidMadeEventData': return ""
    case 'AuctionBidCanceledEventData': return ""
    case 'AuctionCanceledEventData': return ""
    case 'EnglishAuctionSettledEventData': return ""
    case 'BidMadeCompletingAuctionEventData': return ""
    case 'OpenAuctionBidAcceptedEventData': return ""
    case 'NftSellOrderMadeEventData': return ""
    case 'NftBoughtEventData': return ""
    case 'BuyNowCanceledEventData': return ""
    case 'BuyNowPriceUpdatedEventData': return ""
    case 'MetaprotocolTransactionStatusEventData': return ""
    case 'ChannelRewardClaimedEventData': return ""
    case 'ChannelRewardClaimedAndWithdrawnEventData': return ""
    case 'ChannelFundsWithdrawnEventData': return ""
    case 'ChannelPayoutsUpdatedEventData': return ""
    case 'ChannelPaymentMadeEventData': return ""
    case 'MemberBannedFromChannelEventData': return ""
    case 'ChannelCreatedEventData': return ""
    default: throw new TypeError('Unknown json object passed as EventData')
  }
}
