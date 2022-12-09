import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Unique as Unique_, ManyToOne as ManyToOne_, Index as Index_, OneToOne as OneToOne_, JoinColumn as JoinColumn_} from "typeorm"
import * as marshal from "./marshal"
import {VideoMediaEncoding} from "./videoMediaEncoding.model"
import {Video} from "./video.model"

@Unique_('VideoMediaMetadata_video', ["video"], {  deferrable: 'INITIALLY DEFERRED' })
@Entity_()
export class VideoMediaMetadata {
    constructor(props?: Partial<VideoMediaMetadata>) {
        Object.assign(this, props)
    }

    /**
     * Unique identifier
     */
    @PrimaryColumn_()
    id!: string

    /**
     * Encoding of the video media object
     */
    @Index_()
    @ManyToOne_(() => VideoMediaEncoding, {nullable: true, deferrable: 'INITIALLY DEFERRED'})
    encoding!: VideoMediaEncoding | undefined | null

    @Column_({ nullable: true })
    encodingId!: string | null | undefined

    /**
     * Video media width in pixels
     */
    @Column_("int4", {nullable: true})
    pixelWidth!: number | undefined | null

    /**
     * Video media height in pixels
     */
    @Column_("int4", {nullable: true})
    pixelHeight!: number | undefined | null

    /**
     * Video media size in bytes
     */
    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
    size!: bigint | undefined | null

    @Index_()
    @OneToOne_(() => Video, {nullable: false, deferrable: 'INITIALLY DEFERRED'})
    @JoinColumn_()
    video!: Video

    @Column_()
    videoId!: string

    @Column_("int4", {nullable: false})
    createdInBlock!: number
}
