import assert from "assert"
import * as marshal from "./marshal"
import {MetaprotocolTransactionResult, fromJsonMetaprotocolTransactionResult} from "./_metaprotocolTransactionResult"

export class MetaprotocolTransactionStatusEventData {
    public readonly isTypeOf = 'MetaprotocolTransactionStatusEventData'
    private _result!: MetaprotocolTransactionResult

    constructor(props?: Partial<Omit<MetaprotocolTransactionStatusEventData, 'toJSON'>>, json?: any) {
        Object.assign(this, props)
        if (json != null) {
            this._result = fromJsonMetaprotocolTransactionResult(json.result)
        }
    }

    /**
     * The result of metaprotocol action
     */
    get result(): MetaprotocolTransactionResult {
        assert(this._result != null, 'uninitialized access')
        return this._result
    }

    set result(value: MetaprotocolTransactionResult) {
        this._result = value
    }

    toJSON(): object {
        return {
            isTypeOf: this.isTypeOf,
            result: this.result.toJSON(),
        }
    }
}
