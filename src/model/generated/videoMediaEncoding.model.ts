import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_} from "typeorm"

@Entity_()
export class VideoMediaEncoding {
    constructor(props?: Partial<VideoMediaEncoding>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    /**
     * Encoding of the video media object
     */
    @Column_("text", {nullable: true})
    codecName!: string | undefined | null

    /**
     * Media container format
     */
    @Column_("text", {nullable: true})
    container!: string | undefined | null

    /**
     * Content MIME type
     */
    @Column_("text", {nullable: true})
    mimeMediaType!: string | undefined | null
}
