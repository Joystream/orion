import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import {Membership} from "./membership.model"
import {Comment} from "./comment.model"
import {Video} from "./video.model"

@Entity_()
export class CommentReaction {
    constructor(props?: Partial<CommentReaction>) {
        Object.assign(this, props)
    }

    /**
     * {memberId}-{commentId}-{reactionId}
     */
    @PrimaryColumn_()
    id!: string

    /**
     * The Reaction id
     */
    @Column_("int4", {nullable: false})
    reactionId!: number

    /**
     * The member that reacted
     */
    @Index_()
    @ManyToOne_(() => Membership, {nullable: true, deferrable: 'INITIALLY DEFERRED'})
    member!: Membership

    @Column_({ nullable: true })
    memberId!: string | null | undefined

    /**
     * The comment that has been reacted to
     */
    @Index_()
    @ManyToOne_(() => Comment, {nullable: true, deferrable: 'INITIALLY DEFERRED'})
    comment!: Comment

    @Column_({ nullable: true })
    commentId!: string | null | undefined

    /**
     * The video the comment (that has been reacted) exists
     */
    @Index_()
    @ManyToOne_(() => Video, {nullable: true, deferrable: 'INITIALLY DEFERRED'})
    video!: Video

    @Column_({ nullable: true })
    videoId!: string | null | undefined
}
