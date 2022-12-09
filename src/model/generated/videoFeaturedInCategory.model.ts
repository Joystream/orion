import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Unique as Unique_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import {Video} from "./video.model"
import {VideoCategory} from "./videoCategory.model"

@Unique_('VideoFeaturedInCategory_category_video', ["category", "video"], {  deferrable: 'INITIALLY DEFERRED' })
@Index_(["category", "video"])
@Entity_()
export class VideoFeaturedInCategory {
    constructor(props?: Partial<VideoFeaturedInCategory>) {
        Object.assign(this, props)
    }

    /**
     * {categoryId-videoId}
     */
    @PrimaryColumn_()
    id!: string

    /**
     * Video being featured
     */
    @Index_()
    @ManyToOne_(() => Video, {nullable: true, deferrable: 'INITIALLY DEFERRED'})
    video!: Video

    @Column_({ nullable: true })
    videoId!: string | null | undefined

    /**
     * Category the video is featured in
     */
    @ManyToOne_(() => VideoCategory, {nullable: true, deferrable: 'INITIALLY DEFERRED'})
    category!: VideoCategory

    @Column_({ nullable: true })
    categoryId!: string | null | undefined

    /**
     * Url to video fragment to be displayed in the UI
     */
    @Column_("text", {nullable: true})
    videoCutUrl!: string | undefined | null
}
