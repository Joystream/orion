import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, OneToMany as OneToMany_} from "typeorm"
import {DistributionBucketFamilyMetadata} from "./distributionBucketFamilyMetadata.model"
import {DistributionBucket} from "./distributionBucket.model"

@Entity_()
export class DistributionBucketFamily {
    constructor(props?: Partial<DistributionBucketFamily>) {
        Object.assign(this, props)
    }

    /**
     * Runtime bucket family id
     */
    @PrimaryColumn_()
    id!: string

    /**
     * Current bucket family metadata
     */

    /**
     * Distribution buckets belonging to the family
     */
    @OneToMany_(() => DistributionBucket, e => e.family)
    buckets!: DistributionBucket[]
}
