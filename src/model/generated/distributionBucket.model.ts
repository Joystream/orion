import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, OneToMany as OneToMany_} from "typeorm"
import {DistributionBucketFamily} from "./distributionBucketFamily.model"
import {DistributionBucketOperator} from "./distributionBucketOperator.model"
import {DistributionBucketBag} from "./distributionBucketBag.model"

@Entity_()
export class DistributionBucket {
    constructor(props?: Partial<DistributionBucket>) {
        Object.assign(this, props)
    }

    /**
     * Runtime bucket id in {familyId}:{bucketIndex} format
     */
    @PrimaryColumn_()
    id!: string

    /**
     * Distribution family the bucket is part of
     */
    @Index_()
    @ManyToOne_(() => DistributionBucketFamily, {nullable: true, deferrable: 'INITIALLY DEFERRED'})
    family!: DistributionBucketFamily

    @Column_({ nullable: true })
    familyId!: string | null | undefined

    /**
     * Bucket index within the family
     */
    @Column_("int4", {nullable: false})
    bucketIndex!: number

    /**
     * Distribution bucket operators (either active or invited)
     */
    @OneToMany_(() => DistributionBucketOperator, e => e.distributionBucket)
    operators!: DistributionBucketOperator[]

    /**
     * Whether the bucket is accepting any new bags
     */
    @Column_("bool", {nullable: false})
    acceptingNewBags!: boolean

    /**
     * Whether the bucket is currently distributing content
     */
    @Column_("bool", {nullable: false})
    distributing!: boolean

    /**
     * Storage bags assigned to the bucket
     */
    @OneToMany_(() => DistributionBucketBag, e => e.distributionBucket)
    bags!: DistributionBucketBag[]
}
