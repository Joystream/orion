import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import {Membership} from "./membership.model"
import {Event} from "./event.model"

@Entity_()
export class NftActivity {
    constructor(props?: Partial<NftActivity>) {
        Object.assign(this, props)
    }

    /**
     * Autoincremented
     */
    @PrimaryColumn_()
    id!: string

    /**
     * The member the activity relates to
     */
    @Index_()
    @ManyToOne_(() => Membership, {nullable: true, deferrable: 'INITIALLY DEFERRED'})
    member!: Membership

    @Column_({ nullable: true })
    memberId!: string | null | undefined

    /**
     * Nft-related activity
     */
    @Index_()
    @ManyToOne_(() => Event, {nullable: true, deferrable: 'INITIALLY DEFERRED'})
    event!: Event

    @Column_({ nullable: true })
    eventId!: string | null | undefined
}
