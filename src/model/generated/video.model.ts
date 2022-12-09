import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, OneToMany as OneToMany_} from "typeorm"
import * as marshal from "./marshal"
import {Channel} from "./channel.model"
import {VideoCategory} from "./videoCategory.model"
import {StorageDataObject} from "./storageDataObject.model"
import {OwnedNft} from "./ownedNft.model"
import {License} from "./license.model"
import {VideoMediaMetadata} from "./videoMediaMetadata.model"
import {VideoSubtitle} from "./videoSubtitle.model"
import {Comment} from "./comment.model"
import {VideoReaction} from "./videoReaction.model"
import {VideoReactionsCountByReactionType} from "./_videoReactionsCountByReactionType"
import {App} from "./app.model"

@Entity_()
export class Video {
    constructor(props?: Partial<Video>) {
        Object.assign(this, props)
    }

    /**
     * Runtime identifier
     */
    @PrimaryColumn_()
    id!: string

    /**
     * Timestamp of the block the video was created at
     */
    @Column_("timestamp with time zone", {nullable: false})
    createdAt!: Date

    /**
     * Reference to videos's channel
     */
    @Index_()
    @ManyToOne_(() => Channel, {nullable: true, deferrable: 'INITIALLY DEFERRED'})
    channel!: Channel

    @Column_({ nullable: true })
    channelId!: string | null | undefined

    /**
     * Reference to a video category
     */
    @Index_()
    @ManyToOne_(() => VideoCategory, {nullable: true, deferrable: 'INITIALLY DEFERRED'})
    category!: VideoCategory | undefined | null

    @Column_({ nullable: true })
    categoryId!: string | null | undefined

    /**
     * The title of the video
     */
    @Column_("text", {nullable: true})
    title!: string | undefined | null

    /**
     * The description of the Video
     */
    @Column_("text", {nullable: true})
    description!: string | undefined | null

    /**
     * Video duration in seconds
     */
    @Column_("int4", {nullable: true})
    duration!: number | undefined | null

    /**
     * Video thumbnail asset (recommended ratio: 16:9)
     */
    @Index_()
    @ManyToOne_(() => StorageDataObject, {nullable: true, deferrable: 'INITIALLY DEFERRED'})
    thumbnailPhoto!: StorageDataObject | undefined | null

    @Column_({ nullable: true })
    thumbnailPhotoId!: string | null | undefined

    /**
     * Video's main langauge
     */
    @Index_()
    @Column_("text", {nullable: true})
    language!: string | undefined | null

    /**
     * Whether or not Video contains marketing
     */
    @Column_("bool", {nullable: true})
    hasMarketing!: boolean | undefined | null

    /**
     * If the Video was published on other platform before beeing published on Joystream - the original publication date
     */
    @Column_("timestamp with time zone", {nullable: true})
    publishedBeforeJoystream!: Date | undefined | null

    /**
     * Whether the Video is supposed to be publically displayed
     */
    @Column_("bool", {nullable: true})
    isPublic!: boolean | undefined | null

    /**
     * Flag signaling whether a video is censored.
     */
    @Column_("bool", {nullable: false})
    isCensored!: boolean

    /**
     * Whether a video has been excluded/hidden (by the gateway operator)
     */
    @Column_("bool", {nullable: false})
    isExcluded!: boolean

    /**
     * Video NFT details
     */

    /**
     * Whether the Video contains explicit material.
     */
    @Column_("bool", {nullable: true})
    isExplicit!: boolean | undefined | null

    /**
     * License under the video is published
     */
    @Index_()
    @ManyToOne_(() => License, {nullable: true, deferrable: 'INITIALLY DEFERRED'})
    license!: License | undefined | null

    @Column_({ nullable: true })
    licenseId!: string | null | undefined

    /**
     * Video media asset
     */
    @Index_()
    @ManyToOne_(() => StorageDataObject, {nullable: true, deferrable: 'INITIALLY DEFERRED'})
    media!: StorageDataObject | undefined | null

    @Column_({ nullable: true })
    mediaId!: string | null | undefined

    /**
     * Value of video state bloat bond fee paid by channel owner
     */
    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    videoStateBloatBond!: bigint

    /**
     * Video file metadata
     */

    /**
     * Block the video was created in
     */
    @Column_("int4", {nullable: false})
    createdInBlock!: number

    /**
     * List of video subtitles
     */
    @OneToMany_(() => VideoSubtitle, e => e.video)
    subtitles!: VideoSubtitle[]

    /**
     * Is comment section enabled (true if enabled)
     */
    @Column_("bool", {nullable: false})
    isCommentSectionEnabled!: boolean

    /**
     * channel owner pinned comment
     */
    @Index_()
    @ManyToOne_(() => Comment, {nullable: true, deferrable: 'INITIALLY DEFERRED'})
    pinnedComment!: Comment | undefined | null

    @Column_({ nullable: true })
    pinnedCommentId!: string | null | undefined

    /**
     * List of all video comments
     */
    @OneToMany_(() => Comment, e => e.video)
    comments!: Comment[]

    /**
     * Comments count
     */
    @Column_("int4", {nullable: false})
    commentsCount!: number

    /**
     * Is reactions feature enabled on video (true if enabled i.e. video can be reacted)
     */
    @Column_("bool", {nullable: false})
    isReactionFeatureEnabled!: boolean

    /**
     * List of all video reactions
     */
    @OneToMany_(() => VideoReaction, e => e.video)
    reactions!: VideoReaction[]

    /**
     * Reactions count by reaction Id
     */
    @Column_("jsonb", {transformer: {to: obj => obj == null ? undefined : obj.map((val: any) => val.toJSON()), from: obj => obj == null ? undefined : marshal.fromList(obj, val => new VideoReactionsCountByReactionType(undefined, marshal.nonNull(val)))}, nullable: true})
    reactionsCountByReactionId!: (VideoReactionsCountByReactionType)[] | undefined | null

    /**
     * Reactions count
     */
    @Column_("int4", {nullable: false})
    reactionsCount!: number

    /**
     * Number of video views (to speed up orderBy queries by avoiding COUNT aggregation)
     */
    @Column_("int4", {nullable: false})
    viewsNum!: number

    /**
     * Application used for video creation
     */
    @Index_()
    @ManyToOne_(() => App, {nullable: true, deferrable: 'INITIALLY DEFERRED'})
    entryApp!: App | undefined | null

    @Column_({ nullable: true })
    entryAppId!: string | null | undefined

    /**
     * Video ID coming from YPP
     */
    @Column_("text", {nullable: true})
    ytVideoId!: string | undefined | null

    /**
     * Video relevance score based on the views, reactions, comments and update date
     */
    @Index_()
    @Column_("numeric", {transformer: marshal.floatTransformer, nullable: false})
    videoRelevance!: number
}
