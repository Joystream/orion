import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import {User} from "./user.model"

@Entity_()
export class ChannelFollow {
    constructor(props?: Partial<ChannelFollow>) {
        Object.assign(this, props)
    }

    /**
     * Unique identifier of the follow
     */
    @PrimaryColumn_()
    id!: string

    /**
     * User that followed the channel
     */
    @Index_()
    @ManyToOne_(() => User, {nullable: true, deferrable: 'INITIALLY DEFERRED'})
    user!: User

    @Column_({ nullable: true })
    userId!: string | null | undefined

    /**
     * ID of the channel being followed (the channel may no longer exist)
     */
    @Index_()
    @Column_("text", {nullable: false})
    channelId!: string

    /**
     * Time when user started following the channel
     */
    @Column_("timestamp with time zone", {nullable: false})
    timestamp!: Date
}
