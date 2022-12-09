import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_, ManyToOne as ManyToOne_} from "typeorm"
import {User} from "./user.model"

@Entity_()
export class VideoViewEvent {
    constructor(props?: Partial<VideoViewEvent>) {
        Object.assign(this, props)
    }

    /**
     * Unique identifier of the video view event
     */
    @PrimaryColumn_()
    id!: string

    /**
     * ID of the video that was viewed (the video may no longer exist)
     */
    @Index_()
    @Column_("text", {nullable: false})
    videoId!: string

    /**
     * User that viewed the video
     */
    @Index_()
    @ManyToOne_(() => User, {nullable: true, deferrable: 'INITIALLY DEFERRED'})
    user!: User

    @Column_({ nullable: true })
    userId!: string | null | undefined

    /**
     * Video view event timestamp
     */
    @Column_("timestamp with time zone", {nullable: false})
    timestamp!: Date
}
