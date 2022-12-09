import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, OneToMany as OneToMany_} from "typeorm"
import * as marshal from "./marshal"
import {StorageBucketOperatorStatus, fromJsonStorageBucketOperatorStatus} from "./_storageBucketOperatorStatus"
import {StorageBucketOperatorMetadata} from "./storageBucketOperatorMetadata.model"
import {StorageBucketBag} from "./storageBucketBag.model"

@Entity_()
export class StorageBucket {
    constructor(props?: Partial<StorageBucket>) {
        Object.assign(this, props)
    }

    /**
     * Runtime bucket id
     */
    @PrimaryColumn_()
    id!: string

    /**
     * Current bucket operator status
     */
    @Column_("jsonb", {transformer: {to: obj => obj.toJSON(), from: obj => obj == null ? undefined : fromJsonStorageBucketOperatorStatus(obj)}, nullable: false})
    operatorStatus!: StorageBucketOperatorStatus

    /**
     * Storage bucket operator metadata
     */

    /**
     * Whether the bucket is accepting any new storage bags
     */
    @Column_("bool", {nullable: false})
    acceptingNewBags!: boolean

    /**
     * Storage bags assigned to the bucket
     */
    @OneToMany_(() => StorageBucketBag, e => e.storageBucket)
    bags!: StorageBucketBag[]

    /**
     * Bucket's data object size limit in bytes
     */
    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    dataObjectsSizeLimit!: bigint

    /**
     * Bucket's data object count limit
     */
    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    dataObjectCountLimit!: bigint

    /**
     * Number of assigned data objects
     */
    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    dataObjectsCount!: bigint

    /**
     * Total size of assigned data objects
     */
    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    dataObjectsSize!: bigint
}
