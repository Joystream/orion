import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Unique as Unique_, OneToOne as OneToOne_, Index as Index_, JoinColumn as JoinColumn_, OneToMany as OneToMany_} from "typeorm"
import * as marshal from "./marshal"
import {Video} from "./video.model"
import {Auction} from "./auction.model"
import {NftOwner, fromJsonNftOwner} from "./_nftOwner"
import {TransactionalStatus, fromJsonTransactionalStatus} from "./_transactionalStatus"
import {Bid} from "./bid.model"

/**
 * Represents NFT details
 */
@Unique_('OwnedNft_video', ["video"], {  deferrable: 'INITIALLY DEFERRED' })
@Entity_()
export class OwnedNft {
    constructor(props?: Partial<OwnedNft>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    /**
     * Timestamp of the block the NFT was created at
     */
    @Column_("timestamp with time zone", {nullable: false})
    createdAt!: Date

    /**
     * NFT's video
     */
    @Index_()
    @OneToOne_(() => Video, {nullable: false, deferrable: 'INITIALLY DEFERRED'})
    @JoinColumn_()
    video!: Video

    @Column_()
    videoId!: string

    /**
     * Auctions done for this NFT
     */
    @OneToMany_(() => Auction, e => e.nft)
    auctions!: Auction[]

    /**
     * Current owner of the NFT.
     */
    @Column_("jsonb", {transformer: {to: obj => obj.toJSON(), from: obj => obj == null ? undefined : fromJsonNftOwner(obj)}, nullable: false})
    owner!: NftOwner

    /**
     * NFT's transactional status
     */
    @Column_("jsonb", {transformer: {to: obj => obj == null ? undefined : obj.toJSON(), from: obj => obj == null ? undefined : fromJsonTransactionalStatus(obj)}, nullable: true})
    transactionalStatus!: TransactionalStatus | undefined | null

    /**
     * Creator royalty (if any)
     */
    @Column_("numeric", {transformer: marshal.floatTransformer, nullable: true})
    creatorRoyalty!: number | undefined | null

    /**
     * NFT's last sale price (if any)
     */
    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
    lastSalePrice!: bigint | undefined | null

    /**
     * NFT's last sale date (if any)
     */
    @Column_("timestamp with time zone", {nullable: true})
    lastSaleDate!: Date | undefined | null

    /**
     * All NFT auction bids
     */
    @OneToMany_(() => Bid, e => e.nft)
    bids!: Bid[]

    /**
     * Flag to indicate whether the NFT is featured or not
     */
    @Column_("bool", {nullable: false})
    isFeatured!: boolean
}
