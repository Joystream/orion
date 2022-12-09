import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import {User} from "./user.model"

@Entity_()
export class NftFeaturingRequest {
    constructor(props?: Partial<NftFeaturingRequest>) {
        Object.assign(this, props)
    }

    /**
     * Unique identifier of the request
     */
    @PrimaryColumn_()
    id!: string

    /**
     * User that requested the nft to be featured
     */
    @Index_()
    @ManyToOne_(() => User, {nullable: true, deferrable: 'INITIALLY DEFERRED'})
    user!: User

    @Column_({ nullable: true })
    userId!: string | null | undefined

    /**
     * ID of the nft that is being requested to be featured by operator
     */
    @Index_()
    @Column_("text", {nullable: false})
    nftId!: string

    /**
     * Time of the request
     */
    @Column_("timestamp with time zone", {nullable: false})
    timestamp!: Date

    /**
     * Rationale behind the request
     */
    @Column_("text", {nullable: false})
    rationale!: string
}
