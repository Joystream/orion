import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, OneToMany as OneToMany_} from "typeorm"
import * as marshal from "./marshal"
import {StorageDataObject} from "./storageDataObject.model"
import {StorageBucketBag} from "./storageBucketBag.model"
import {DistributionBucketBag} from "./distributionBucketBag.model"
import {StorageBagOwner, fromJsonStorageBagOwner} from "./_storageBagOwner"

@Entity_()
export class StorageBag {
    constructor(props?: Partial<StorageBag>) {
        Object.assign(this, props)
    }

    /**
     * Storage bag id
     */
    @PrimaryColumn_()
    id!: string

    /**
     * Data objects in the bag
     */
    @OneToMany_(() => StorageDataObject, e => e.storageBag)
    objects!: StorageDataObject[]

    /**
     * Storage buckets assigned to the bag
     */
    @OneToMany_(() => StorageBucketBag, e => e.bag)
    storageBuckets!: StorageBucketBag[]

    /**
     * Distribution buckets assigned to the bag
     */
    @OneToMany_(() => DistributionBucketBag, e => e.bag)
    distributionBuckets!: DistributionBucketBag[]

    /**
     * Owner of the storage bag
     */
    @Column_("jsonb", {transformer: {to: obj => obj.toJSON(), from: obj => obj == null ? undefined : fromJsonStorageBagOwner(obj)}, nullable: false})
    owner!: StorageBagOwner
}
