import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, OneToMany as OneToMany_} from "typeorm"
import * as marshal from "./marshal"
import {Membership} from "./membership.model"
import {StorageDataObject} from "./storageDataObject.model"
import {Video} from "./video.model"
import {BannedMember} from "./bannedMember.model"
import {App} from "./app.model"

@Entity_()
export class Channel {
    constructor(props?: Partial<Channel>) {
        Object.assign(this, props)
    }

    /**
     * Runtime entity identifier (EntityId)
     */
    @PrimaryColumn_()
    id!: string

    /**
     * Timestamp of the block the channel was created at
     */
    @Column_("timestamp with time zone", {nullable: false})
    createdAt!: Date

    /**
     * Current member-owner of the channel (if owned by a member)
     */
    @Index_()
    @ManyToOne_(() => Membership, {nullable: true, deferrable: 'INITIALLY DEFERRED'})
    ownerMember!: Membership | undefined | null

    @Column_({ nullable: true })
    ownerMemberId!: string | null | undefined

    /**
     * The title of the Channel
     */
    @Column_("text", {nullable: true})
    title!: string | undefined | null

    /**
     * The description of a Channel
     */
    @Column_("text", {nullable: true})
    description!: string | undefined | null

    /**
     * Channel's cover (background) photo asset. Recommended ratio: 16:9.
     */
    @Index_()
    @ManyToOne_(() => StorageDataObject, {nullable: true, deferrable: 'INITIALLY DEFERRED'})
    coverPhoto!: StorageDataObject | undefined | null

    @Column_({ nullable: true })
    coverPhotoId!: string | null | undefined

    /**
     * Channel's avatar photo asset.
     */
    @Index_()
    @ManyToOne_(() => StorageDataObject, {nullable: true, deferrable: 'INITIALLY DEFERRED'})
    avatarPhoto!: StorageDataObject | undefined | null

    @Column_({ nullable: true })
    avatarPhotoId!: string | null | undefined

    /**
     * Flag signaling whether a channel is public.
     */
    @Column_("bool", {nullable: true})
    isPublic!: boolean | undefined | null

    /**
     * Flag signaling whether a channel is censored.
     */
    @Column_("bool", {nullable: false})
    isCensored!: boolean

    /**
     * Whether a channel has been excluded/hidden (by the gateway operator)
     */
    @Column_("bool", {nullable: false})
    isExcluded!: boolean

    /**
     * The primary langauge of the channel's content
     */
    @Index_()
    @Column_("text", {nullable: true})
    language!: string | undefined | null

    /**
     * List of videos that belong to the channel
     */
    @OneToMany_(() => Video, e => e.channel)
    videos!: Video[]

    /**
     * Number of the block the channel was created in
     */
    @Column_("int4", {nullable: false})
    createdInBlock!: number

    /**
     * Channel's reward account, storing the income from the nft sales and channel payouts.
     */
    @Column_("text", {nullable: false})
    rewardAccount!: string

    /**
     * Value of channel state bloat bond fee paid by channel creator
     */
    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    channelStateBloatBond!: bigint

    /**
     * Number of active follows (to speed up orderBy queries by avoiding COUNT aggregation)
     */
    @Column_("int4", {nullable: false})
    followsNum!: number

    /**
     * Number of total video views (to speed up orderBy queries by avoiding COUNT aggregation)
     */
    @Column_("int4", {nullable: false})
    videoViewsNum!: number

    /**
     * List of members blocked from commenting/reacting on any video of the channel.
     */
    @OneToMany_(() => BannedMember, e => e.channel)
    bannedMembers!: BannedMember[]

    /**
     * Application used for channel creation
     */
    @Index_()
    @ManyToOne_(() => App, {nullable: true, deferrable: 'INITIALLY DEFERRED'})
    entryApp!: App | undefined | null

    @Column_({ nullable: true })
    entryAppId!: string | null | undefined

    /**
     * Number of videos ever created in this channel
     */
    @Column_("int4", {nullable: false})
    totalVideosCreated!: number

    /**
     * Cumulative rewards claimed by this channel
     */
    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
    cumulativeRewardClaimed!: bigint | undefined | null
}
