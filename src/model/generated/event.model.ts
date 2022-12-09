import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
import {EventData, fromJsonEventData} from "./_eventData"

@Entity_()
export class Event {
    constructor(props?: Partial<Event>) {
        Object.assign(this, props)
    }

    /**
     * {blockNumber}-{indexInBlock}
     */
    @PrimaryColumn_()
    id!: string

    /**
     * Blocknumber of the block in which the event was emitted.
     */
    @Column_("int4", {nullable: false})
    inBlock!: number

    /**
     * Hash of the extrinsic the event was emitted in
     */
    @Index_()
    @Column_("text", {nullable: true})
    inExtrinsic!: string | undefined | null

    /**
     * Index of event in block from which it was emitted.
     */
    @Column_("int4", {nullable: false})
    indexInBlock!: number

    /**
     * Timestamp of the block the event was emitted in
     */
    @Column_("timestamp with time zone", {nullable: false})
    timestamp!: Date

    /**
     * More specific event data, which depends on event type
     */
    @Column_("jsonb", {transformer: {to: obj => obj.toJSON(), from: obj => obj == null ? undefined : fromJsonEventData(obj)}, nullable: false})
    data!: EventData
}
