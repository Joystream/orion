import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import {DistributionBucket} from "./distributionBucket.model"
import {DistributionBucketOperatorStatus} from "./_distributionBucketOperatorStatus"
import {DistributionBucketOperatorMetadata} from "./distributionBucketOperatorMetadata.model"

@Entity_()
export class DistributionBucketOperator {
    constructor(props?: Partial<DistributionBucketOperator>) {
        Object.assign(this, props)
    }

    /**
     * {bucketId}-{workerId}
     */
    @PrimaryColumn_()
    id!: string

    /**
     * Related distirbution bucket
     */
    @Index_()
    @ManyToOne_(() => DistributionBucket, {nullable: true, deferrable: 'INITIALLY DEFERRED'})
    distributionBucket!: DistributionBucket

    @Column_({ nullable: true })
    distributionBucketId!: string | null | undefined

    /**
     * ID of the distribution group worker
     */
    @Column_("int4", {nullable: false})
    workerId!: number

    /**
     * Current operator status
     */
    @Column_("varchar", {length: 7, nullable: false})
    status!: DistributionBucketOperatorStatus

    /**
     * Operator metadata
     */
}
