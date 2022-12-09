import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Unique as Unique_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import {DistributionBucket} from "./distributionBucket.model"
import {StorageBag} from "./storageBag.model"

@Unique_('DistributionBucketBag_distributionBucket_bag', ["distributionBucket", "bag"], {  deferrable: 'INITIALLY DEFERRED' })
@Index_(["distributionBucket", "bag"])
@Entity_()
export class DistributionBucketBag {
    constructor(props?: Partial<DistributionBucketBag>) {
        Object.assign(this, props)
    }

    /**
     * {distributionBucketId}-{storageBagId}
     */
    @PrimaryColumn_()
    id!: string

    @ManyToOne_(() => DistributionBucket, {nullable: true, deferrable: 'INITIALLY DEFERRED'})
    distributionBucket!: DistributionBucket

    @Column_({ nullable: true })
    distributionBucketId!: string | null | undefined

    @Index_()
    @ManyToOne_(() => StorageBag, {nullable: true, deferrable: 'INITIALLY DEFERRED'})
    bag!: StorageBag

    @Column_({ nullable: true })
    bagId!: string | null | undefined
}
