import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import {Membership} from "./membership.model"
import {Event} from "./event.model"

@Entity_()
export class Notification {
    constructor(props?: Partial<Notification>) {
        Object.assign(this, props)
    }

    /**
     * Autoincremented
     */
    @PrimaryColumn_()
    id!: string

    /**
     * Member that should recieve the notification
     */
    @Index_()
    @ManyToOne_(() => Membership, {nullable: true, deferrable: 'INITIALLY DEFERRED'})
    member!: Membership

    @Column_({ nullable: true })
    memberId!: string | null | undefined

    /**
     * The notification event
     */
    @Index_()
    @ManyToOne_(() => Event, {nullable: true, deferrable: 'INITIALLY DEFERRED'})
    event!: Event

    @Column_({ nullable: true })
    eventId!: string | null | undefined
}
