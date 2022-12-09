import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Unique as Unique_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import {Auction} from "./auction.model"
import {Membership} from "./membership.model"

@Unique_('AuctionWhitelistedMember_auction_member', ["auction", "member"], {  deferrable: 'INITIALLY DEFERRED' })
@Index_(["auction", "member"])
@Entity_()
export class AuctionWhitelistedMember {
    constructor(props?: Partial<AuctionWhitelistedMember>) {
        Object.assign(this, props)
    }

    /**
     * {auctionId}-{memberId}
     */
    @PrimaryColumn_()
    id!: string

    @ManyToOne_(() => Auction, {nullable: true, deferrable: 'INITIALLY DEFERRED'})
    auction!: Auction

    @Column_({ nullable: true })
    auctionId!: string | null | undefined

    @Index_()
    @ManyToOne_(() => Membership, {nullable: true, deferrable: 'INITIALLY DEFERRED'})
    member!: Membership

    @Column_({ nullable: true })
    memberId!: string | null | undefined
}
