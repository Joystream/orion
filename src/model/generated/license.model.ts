import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_} from "typeorm"

@Entity_()
export class License {
    constructor(props?: Partial<License>) {
        Object.assign(this, props)
    }

    /**
     * Unique identifier
     */
    @PrimaryColumn_()
    id!: string

    /**
     * License code defined by Joystream
     */
    @Column_("int4", {nullable: true})
    code!: number | undefined | null

    /**
     * Attribution (if required by the license)
     */
    @Column_("text", {nullable: true})
    attribution!: string | undefined | null

    /**
     * Custom license content
     */
    @Column_("text", {nullable: true})
    customText!: string | undefined | null
}
