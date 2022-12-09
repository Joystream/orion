import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Unique as Unique_, Index as Index_, OneToMany as OneToMany_} from "typeorm"
import {MemberMetadata} from "./memberMetadata.model"
import {AuctionWhitelistedMember} from "./auctionWhitelistedMember.model"
import {Channel} from "./channel.model"
import {BannedMember} from "./bannedMember.model"

/**
 * Stored information about a registered user
 */
@Unique_('Membership_handle', ["handle"], {  deferrable: 'INITIALLY DEFERRED' })
@Entity_()
export class Membership {
    constructor(props?: Partial<Membership>) {
        Object.assign(this, props)
    }

    /**
     * MemberId: runtime identifier for a user
     */
    @PrimaryColumn_()
    id!: string

    /**
     * Timestamp of the block the membership was created at
     */
    @Column_("timestamp with time zone", {nullable: false})
    createdAt!: Date

    /**
     * The unique handle chosen by member
     */
    @Index_()
    @Column_("text", {nullable: false})
    handle!: string

    /**
     * Member's metadata
     */

    /**
     * Member's controller account id
     */
    @Column_("text", {nullable: false})
    controllerAccount!: string

    /**
     * Auctions in which is this user whitelisted to participate
     */
    @OneToMany_(() => AuctionWhitelistedMember, e => e.member)
    whitelistedInAuctions!: AuctionWhitelistedMember[]

    /**
     * Channels owned by this member
     */
    @OneToMany_(() => Channel, e => e.ownerMember)
    channels!: Channel[]

    /**
     * Channels the member is banned from (in terms of commenting/reacting)
     */
    @OneToMany_(() => BannedMember, e => e.member)
    bannedFromChannels!: BannedMember[]

    /**
     * Number of channels ever created by this member
     */
    @Column_("int4", {nullable: false})
    totalChannelsCreated!: number
}
