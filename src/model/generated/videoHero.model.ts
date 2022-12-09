import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import {Video} from "./video.model"

@Entity_()
export class VideoHero {
    constructor(props?: Partial<VideoHero>) {
        Object.assign(this, props)
    }

    /**
     * Unique ID
     */
    @PrimaryColumn_()
    id!: string

    /**
     * Video being featured in the Hero section
     */
    @Index_()
    @ManyToOne_(() => Video, {nullable: true, deferrable: 'INITIALLY DEFERRED'})
    video!: Video

    @Column_({ nullable: true })
    videoId!: string | null | undefined

    /**
     * Title of the Hero section
     */
    @Column_("text", {nullable: false})
    heroTitle!: string

    /**
     * Url to video fragment to be displayed in the Hero section
     */
    @Column_("text", {nullable: false})
    heroVideoCutUrl!: string

    /**
     * Url to the poster to be displayed in the Hero section
     */
    @Column_("text", {nullable: false})
    heroPosterUrl!: string

    /**
     * Time at which this VideoHero was created/activated
     */
    @Column_("timestamp with time zone", {nullable: true})
    activatedAt!: Date | undefined | null
}
