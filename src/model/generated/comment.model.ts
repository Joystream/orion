import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, OneToMany as OneToMany_} from "typeorm"
import * as marshal from "./marshal"
import {Membership} from "./membership.model"
import {Video} from "./video.model"
import {CommentStatus} from "./_commentStatus"
import {CommentReaction} from "./commentReaction.model"
import {CommentReactionsCountByReactionId} from "./_commentReactionsCountByReactionId"

@Entity_()
export class Comment {
    constructor(props?: Partial<Comment>) {
        Object.assign(this, props)
    }

    /**
     * METAPROTOCOL-{network}-{blockNumber}-{indexInBlock}
     */
    @PrimaryColumn_()
    id!: string

    /**
     * Timestamp of the block the comment was created at
     */
    @Column_("timestamp with time zone", {nullable: false})
    createdAt!: Date

    /**
     * Author of the video comment
     */
    @Index_()
    @ManyToOne_(() => Membership, {nullable: true, deferrable: 'INITIALLY DEFERRED'})
    author!: Membership

    @Column_({ nullable: true })
    authorId!: string | null | undefined

    /**
     * Comment text
     */
    @Column_("text", {nullable: false})
    text!: string

    /**
     * Video the comment was added to
     */
    @Index_()
    @ManyToOne_(() => Video, {nullable: true, deferrable: 'INITIALLY DEFERRED'})
    video!: Video

    @Column_({ nullable: true })
    videoId!: string | null | undefined

    /**
     * Status of the comment; either it is visible, deleted, or moderated (deleted by moderator)
     */
    @Index_()
    @Column_("varchar", {length: 9, nullable: false})
    status!: CommentStatus

    /**
     * List of all reactions to the comment
     */
    @OneToMany_(() => CommentReaction, e => e.comment)
    reactions!: CommentReaction[]

    /**
     * Reactions count by reaction Id
     */
    @Column_("jsonb", {transformer: {to: obj => obj == null ? undefined : obj.map((val: any) => val.toJSON()), from: obj => obj == null ? undefined : marshal.fromList(obj, val => new CommentReactionsCountByReactionId(undefined, marshal.nonNull(val)))}, nullable: true})
    reactionsCountByReactionId!: (CommentReactionsCountByReactionId)[] | undefined | null

    /**
     * A (parent) comment that this comment replies to (if any)
     */
    @Index_()
    @ManyToOne_(() => Comment, {nullable: true, deferrable: 'INITIALLY DEFERRED'})
    parentComment!: Comment | undefined | null

    @Column_({ nullable: true })
    parentCommentId!: string | null | undefined

    /**
     * How many comments has replied to this comment
     */
    @Column_("int4", {nullable: false})
    repliesCount!: number

    /**
     * Total number of reactions to this comment
     */
    @Column_("int4", {nullable: false})
    reactionsCount!: number

    /**
     * Sum of replies and reactions
     */
    @Column_("int4", {nullable: false})
    reactionsAndRepliesCount!: number

    /**
     * Whether comment has been edited or not
     */
    @Column_("bool", {nullable: false})
    isEdited!: boolean

    /**
     * Whether a comment has been excluded/hidden (by the gateway operator)
     */
    @Column_("bool", {nullable: false})
    isExcluded!: boolean
}
