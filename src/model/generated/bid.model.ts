import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
import {Auction} from "./auction.model"
import {OwnedNft} from "./ownedNft.model"
import {Membership} from "./membership.model"

/**
 * Represents bid in NFT auction
 */
@Entity_()
export class Bid {
    constructor(props?: Partial<Bid>) {
        Object.assign(this, props)
    }

    /**
     * Unique identifier
     */
    @PrimaryColumn_()
    id!: string

    /**
     * Timestamp of the block the bid was created at
     */
    @Column_("timestamp with time zone", {nullable: false})
    createdAt!: Date

    /**
     * NFT's auction
     */
    @Index_()
    @ManyToOne_(() => Auction, {nullable: true, deferrable: 'INITIALLY DEFERRED'})
    auction!: Auction

    @Column_({ nullable: true })
    auctionId!: string | null | undefined

    /**
     * Bid's NFT
     */
    @Index_()
    @ManyToOne_(() => OwnedNft, {nullable: true, deferrable: 'INITIALLY DEFERRED'})
    nft!: OwnedNft

    @Column_({ nullable: true })
    nftId!: string | null | undefined

    /**
     * Bidder membership
     */
    @Index_()
    @ManyToOne_(() => Membership, {nullable: true, deferrable: 'INITIALLY DEFERRED'})
    bidder!: Membership

    @Column_({ nullable: true })
    bidderId!: string | null | undefined

    /**
     * Amount bidded
     */
    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    amount!: bigint

    /**
     * Sign for canceled bid
     */
    @Column_("bool", {nullable: false})
    isCanceled!: boolean

    /**
     * Block in which the bid was placed
     */
    @Column_("int4", {nullable: false})
    createdInBlock!: number

    /**
     * Index in block of the related AuctionBidMade event
     */
    @Column_("int4", {nullable: false})
    indexInBlock!: number

    /**
     * Bid that was displaced by this bid in the English auction (if any)
     */
    @Index_()
    @ManyToOne_(() => Bid, {nullable: true, deferrable: 'INITIALLY DEFERRED'})
    previousTopBid!: Bid | undefined | null

    @Column_({ nullable: true })
    previousTopBidId!: string | null | undefined
}
