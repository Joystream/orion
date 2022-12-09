import assert from "assert"
import * as marshal from "./marshal"

export class MetaprotocolTransactionResultFailed {
    public readonly isTypeOf = 'MetaprotocolTransactionResultFailed'
    private _errorMessage!: string

    constructor(props?: Partial<Omit<MetaprotocolTransactionResultFailed, 'toJSON'>>, json?: any) {
        Object.assign(this, props)
        if (json != null) {
            this._errorMessage = marshal.string.fromJSON(json.errorMessage)
        }
    }

    get errorMessage(): string {
        assert(this._errorMessage != null, 'uninitialized access')
        return this._errorMessage
    }

    set errorMessage(value: string) {
        this._errorMessage = value
    }

    toJSON(): object {
        return {
            isTypeOf: this.isTypeOf,
            errorMessage: this.errorMessage,
        }
    }
}
