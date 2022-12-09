import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import {User} from "./user.model"

@Entity_()
export class Report {
    constructor(props?: Partial<Report>) {
        Object.assign(this, props)
    }

    /**
     * Unique identifier of the report
     */
    @PrimaryColumn_()
    id!: string

    /**
     * User that reported the channel / video
     */
    @Index_()
    @ManyToOne_(() => User, {nullable: true, deferrable: 'INITIALLY DEFERRED'})
    user!: User

    @Column_({ nullable: true })
    userId!: string | null | undefined

    /**
     * If it's a channel report: ID of the channel being reported (the channel may no longer exist)
     */
    @Index_()
    @Column_("text", {nullable: true})
    channelId!: string | undefined | null

    /**
     * If it's a video report: ID of the video being reported (the video may no longer exist)
     */
    @Index_()
    @Column_("text", {nullable: true})
    videoId!: string | undefined | null

    /**
     * Time of the report
     */
    @Column_("timestamp with time zone", {nullable: false})
    timestamp!: Date

    /**
     * Rationale behind the report
     */
    @Column_("text", {nullable: false})
    rationale!: string
}
