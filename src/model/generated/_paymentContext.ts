import {PaymentContextVideo} from "./_paymentContextVideo"
import {PaymentContextChannel} from "./_paymentContextChannel"

export type PaymentContext = PaymentContextVideo | PaymentContextChannel

export function fromJsonPaymentContext(json: any): PaymentContext {
    switch(json?.isTypeOf) {
        case 'PaymentContextVideo': return new PaymentContextVideo(undefined, json)
        case 'PaymentContextChannel': return new PaymentContextChannel(undefined, json)
        default: throw new TypeError('Unknown json object passed as PaymentContext')
    }
}
