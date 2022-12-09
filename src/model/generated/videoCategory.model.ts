import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_, ManyToOne as ManyToOne_, OneToMany as OneToMany_} from "typeorm"
import {Video} from "./video.model"
import {VideoFeaturedInCategory} from "./videoFeaturedInCategory.model"

@Entity_()
export class VideoCategory {
    constructor(props?: Partial<VideoCategory>) {
        Object.assign(this, props)
    }

    /**
     * Runtime identifier
     */
    @PrimaryColumn_()
    id!: string

    /**
     * The name of the category
     */
    @Index_()
    @Column_("text", {nullable: true})
    name!: string | undefined | null

    /**
     * The description of the category
     */
    @Column_("text", {nullable: true})
    description!: string | undefined | null

    /**
     * Parent category if defined
     */
    @Index_()
    @ManyToOne_(() => VideoCategory, {nullable: true, deferrable: 'INITIALLY DEFERRED'})
    parentCategory!: VideoCategory | undefined | null

    @Column_({ nullable: true })
    parentCategoryId!: string | null | undefined

    @OneToMany_(() => Video, e => e.category)
    videos!: Video[]

    @OneToMany_(() => VideoFeaturedInCategory, e => e.category)
    featuredVideos!: VideoFeaturedInCategory[]

    /**
     * Indicates whether the category is supported by the Gateway
     */
    @Column_("bool", {nullable: false})
    isSupported!: boolean

    @Column_("int4", {nullable: false})
    createdInBlock!: number
}
