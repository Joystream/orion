import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, OneToMany as OneToMany_} from "typeorm"
import * as marshal from "./marshal"
import {OwnedNft} from "./ownedNft.model"
import {Membership} from "./membership.model"
import {AuctionType, fromJsonAuctionType} from "./_auctionType"
import {Bid} from "./bid.model"
import {AuctionWhitelistedMember} from "./auctionWhitelistedMember.model"

/**
 * Represents NFT auction
 */
@Entity_()
export class Auction {
    constructor(props?: Partial<Auction>) {
        Object.assign(this, props)
    }

    /**
     * Unique identifier
     */
    @PrimaryColumn_()
    id!: string

    /**
     * Auctioned NFT
     */
    @Index_()
    @ManyToOne_(() => OwnedNft, {nullable: true, deferrable: 'INITIALLY DEFERRED'})
    nft!: OwnedNft

    @Column_({ nullable: true })
    nftId!: string | null | undefined

    /**
     * Member that won this auction
     */
    @Index_()
    @ManyToOne_(() => Membership, {nullable: true, deferrable: 'INITIALLY DEFERRED'})
    winningMember!: Membership | undefined | null

    @Column_({ nullable: true })
    winningMemberId!: string | null | undefined

    /**
     * Auction starting price
     */
    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    startingPrice!: bigint

    /**
     * Price at which the auction gets completed instantly (if any)
     */
    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
    buyNowPrice!: bigint | undefined | null

    /**
     * The type of auction
     */
    @Column_("jsonb", {transformer: {to: obj => obj.toJSON(), from: obj => obj == null ? undefined : fromJsonAuctionType(obj)}, nullable: false})
    auctionType!: AuctionType

    /**
     * Auction last bid (if exists)
     */
    @Index_()
    @ManyToOne_(() => Bid, {nullable: true, deferrable: 'INITIALLY DEFERRED'})
    topBid!: Bid | undefined | null

    @Column_({ nullable: true })
    topBidId!: string | null | undefined

    /**
     * All bids made during this auction
     */
    @OneToMany_(() => Bid, e => e.auction)
    bids!: Bid[]

    /**
     * Block when auction starts
     */
    @Column_("int4", {nullable: false})
    startsAtBlock!: number

    /**
     * Block when auction ended
     */
    @Column_("int4", {nullable: true})
    endedAtBlock!: number | undefined | null

    /**
     * Is auction canceled
     */
    @Column_("bool", {nullable: false})
    isCanceled!: boolean

    /**
     * Is auction completed
     */
    @Column_("bool", {nullable: false})
    isCompleted!: boolean

    /**
     * Auction participants whitelist
     */
    @OneToMany_(() => AuctionWhitelistedMember, e => e.auction)
    whitelistedMembers!: AuctionWhitelistedMember[]
}
