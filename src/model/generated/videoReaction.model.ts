import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import {VideoReactionOptions} from "./_videoReactionOptions"
import {Membership} from "./membership.model"
import {Video} from "./video.model"

@Entity_()
export class VideoReaction {
    constructor(props?: Partial<VideoReaction>) {
        Object.assign(this, props)
    }

    /**
     * {memberId}-{videoId}
     */
    @PrimaryColumn_()
    id!: string

    /**
     * Timestamp of the block the reaction was created at
     */
    @Column_("timestamp with time zone", {nullable: false})
    createdAt!: Date

    /**
     * The Reaction
     */
    @Column_("varchar", {length: 6, nullable: false})
    reaction!: VideoReactionOptions

    /**
     * The member that reacted
     */
    @Index_()
    @ManyToOne_(() => Membership, {nullable: true, deferrable: 'INITIALLY DEFERRED'})
    member!: Membership

    @Column_({ nullable: true })
    memberId!: string | null | undefined

    /**
     * The video that has been reacted to
     */
    @Index_()
    @ManyToOne_(() => Video, {nullable: true, deferrable: 'INITIALLY DEFERRED'})
    video!: Video

    @Column_({ nullable: true })
    videoId!: string | null | undefined
}
