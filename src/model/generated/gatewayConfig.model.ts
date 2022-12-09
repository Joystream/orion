import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_} from "typeorm"

@Entity_()
export class GatewayConfig {
    constructor(props?: Partial<GatewayConfig>) {
        Object.assign(this, props)
    }

    /**
     * Unique name of the configuration variable
     */
    @PrimaryColumn_()
    id!: string

    /**
     * Value of the configuration variable serialized to a string
     */
    @Column_("text", {nullable: false})
    value!: string

    /**
     * Last time the configuration variable was updated
     */
    @Column_("timestamp with time zone", {nullable: false})
    updatedAt!: Date
}
