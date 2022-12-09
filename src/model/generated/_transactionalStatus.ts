import {TransactionalStatusIdle} from "./_transactionalStatusIdle"
import {TransactionalStatusInitiatedOfferToMember} from "./_transactionalStatusInitiatedOfferToMember"
import {TransactionalStatusBuyNow} from "./_transactionalStatusBuyNow"
import {TransactionalStatusAuction} from "./_transactionalStatusAuction"

export type TransactionalStatus = TransactionalStatusIdle | TransactionalStatusInitiatedOfferToMember | TransactionalStatusBuyNow | TransactionalStatusAuction

export function fromJsonTransactionalStatus(json: any): TransactionalStatus {
    switch(json?.isTypeOf) {
        case 'TransactionalStatusIdle': return new TransactionalStatusIdle(undefined, json)
        case 'TransactionalStatusInitiatedOfferToMember': return new TransactionalStatusInitiatedOfferToMember(undefined, json)
        case 'TransactionalStatusBuyNow': return new TransactionalStatusBuyNow(undefined, json)
        case 'TransactionalStatusAuction': return new TransactionalStatusAuction(undefined, json)
        default: throw new TypeError('Unknown json object passed as TransactionalStatus')
    }
}
