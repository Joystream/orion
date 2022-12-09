import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Unique as Unique_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import {Membership} from "./membership.model"
import {Channel} from "./channel.model"

@Unique_('BannedMember_member_channel', ["member", "channel"], {  deferrable: 'INITIALLY DEFERRED' })
@Index_(["member", "channel"])
@Entity_()
export class BannedMember {
    constructor(props?: Partial<BannedMember>) {
        Object.assign(this, props)
    }

    /**
     * {memberId}-{channelId}
     */
    @PrimaryColumn_()
    id!: string

    @ManyToOne_(() => Membership, {nullable: true, deferrable: 'INITIALLY DEFERRED'})
    member!: Membership

    @Column_({ nullable: true })
    memberId!: string | null | undefined

    @Index_()
    @ManyToOne_(() => Channel, {nullable: true, deferrable: 'INITIALLY DEFERRED'})
    channel!: Channel

    @Column_({ nullable: true })
    channelId!: string | null | undefined
}
