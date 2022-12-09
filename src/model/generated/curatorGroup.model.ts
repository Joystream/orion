import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_} from "typeorm"

@Entity_()
export class CuratorGroup {
    constructor(props?: Partial<CuratorGroup>) {
        Object.assign(this, props)
    }

    /**
     * Runtime identifier
     */
    @PrimaryColumn_()
    id!: string

    /**
     * Is group active or not
     */
    @Column_("bool", {nullable: false})
    isActive!: boolean
}
