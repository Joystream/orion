import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import {Video} from "./video.model"
import {StorageDataObject} from "./storageDataObject.model"

@Entity_()
export class VideoSubtitle {
    constructor(props?: Partial<VideoSubtitle>) {
        Object.assign(this, props)
    }

    /**
     * {type}-{language}
     */
    @PrimaryColumn_()
    id!: string

    /**
     * Subtitle's video
     */
    @Index_()
    @ManyToOne_(() => Video, {nullable: true, deferrable: 'INITIALLY DEFERRED'})
    video!: Video

    @Column_({ nullable: true })
    videoId!: string | null | undefined

    /**
     * Subtitle's type
     */
    @Column_("text", {nullable: false})
    type!: string

    /**
     * Subtitle's language
     */
    @Index_()
    @Column_("text", {nullable: true})
    language!: string | undefined | null

    /**
     * MIME type description of format used for this subtitle
     */
    @Column_("text", {nullable: false})
    mimeType!: string

    /**
     * Storage object representing the subtitle file
     */
    @Index_()
    @ManyToOne_(() => StorageDataObject, {nullable: true, deferrable: 'INITIALLY DEFERRED'})
    asset!: StorageDataObject | undefined | null

    @Column_({ nullable: true })
    assetId!: string | null | undefined
}
