import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_} from "typeorm"

@Entity_()
export class Curator {
    constructor(props?: Partial<Curator>) {
        Object.assign(this, props)
    }

    /**
     * Runtime identifier
     */
    @PrimaryColumn_()
    id!: string
}
