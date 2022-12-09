import {MetaprotocolTransactionResultOK} from "./_metaprotocolTransactionResultOk"
import {MetaprotocolTransactionResultCommentCreated} from "./_metaprotocolTransactionResultCommentCreated"
import {MetaprotocolTransactionResultCommentEdited} from "./_metaprotocolTransactionResultCommentEdited"
import {MetaprotocolTransactionResultCommentDeleted} from "./_metaprotocolTransactionResultCommentDeleted"
import {MetaprotocolTransactionResultCommentModerated} from "./_metaprotocolTransactionResultCommentModerated"
import {MetaprotocolTransactionResultFailed} from "./_metaprotocolTransactionResultFailed"
import {MetaprotocolTransactionResultChannelPaid} from "./_metaprotocolTransactionResultChannelPaid"

export type MetaprotocolTransactionResult = MetaprotocolTransactionResultOK | MetaprotocolTransactionResultCommentCreated | MetaprotocolTransactionResultCommentEdited | MetaprotocolTransactionResultCommentDeleted | MetaprotocolTransactionResultCommentModerated | MetaprotocolTransactionResultFailed | MetaprotocolTransactionResultChannelPaid

export function fromJsonMetaprotocolTransactionResult(json: any): MetaprotocolTransactionResult {
    switch(json?.isTypeOf) {
        case 'MetaprotocolTransactionResultOK': return new MetaprotocolTransactionResultOK(undefined, json)
        case 'MetaprotocolTransactionResultCommentCreated': return new MetaprotocolTransactionResultCommentCreated(undefined, json)
        case 'MetaprotocolTransactionResultCommentEdited': return new MetaprotocolTransactionResultCommentEdited(undefined, json)
        case 'MetaprotocolTransactionResultCommentDeleted': return new MetaprotocolTransactionResultCommentDeleted(undefined, json)
        case 'MetaprotocolTransactionResultCommentModerated': return new MetaprotocolTransactionResultCommentModerated(undefined, json)
        case 'MetaprotocolTransactionResultFailed': return new MetaprotocolTransactionResultFailed(undefined, json)
        case 'MetaprotocolTransactionResultChannelPaid': return new MetaprotocolTransactionResultChannelPaid(undefined, json)
        default: throw new TypeError('Unknown json object passed as MetaprotocolTransactionResult')
    }
}
