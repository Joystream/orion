import assert from "assert"
import * as marshal from "./marshal"
import {Channel} from "./channel.model"
import {Membership} from "./membership.model"

export class MemberBannedFromChannelEventData {
    public readonly isTypeOf = 'MemberBannedFromChannelEventData'
    private _channel!: string
    private _member!: string
    private _action!: boolean

    constructor(props?: Partial<Omit<MemberBannedFromChannelEventData, 'toJSON'>>, json?: any) {
        Object.assign(this, props)
        if (json != null) {
            this._channel = marshal.string.fromJSON(json.channel)
            this._member = marshal.string.fromJSON(json.member)
            this._action = marshal.boolean.fromJSON(json.action)
        }
    }

    /**
     * The chanel the member is being banned / unbanned from
     */
    get channel(): string {
        assert(this._channel != null, 'uninitialized access')
        return this._channel
    }

    set channel(value: string) {
        this._channel = value
    }

    /**
     * The member being banned / unbanned
     */
    get member(): string {
        assert(this._member != null, 'uninitialized access')
        return this._member
    }

    set member(value: string) {
        this._member = value
    }

    /**
     * The action performed. TRUE if the member is being banned, FALSE if the member is being unbanned
     */
    get action(): boolean {
        assert(this._action != null, 'uninitialized access')
        return this._action
    }

    set action(value: boolean) {
        this._action = value
    }

    toJSON(): object {
        return {
            isTypeOf: this.isTypeOf,
            channel: this.channel,
            member: this.member,
            action: this.action,
        }
    }
}
