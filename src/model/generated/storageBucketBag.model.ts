import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Unique as Unique_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import {StorageBucket} from "./storageBucket.model"
import {StorageBag} from "./storageBag.model"

@Unique_('StorageBucketBag_storageBucket_bag', ["storageBucket", "bag"], {  deferrable: 'INITIALLY DEFERRED' })
@Index_(["storageBucket", "bag"])
@Entity_()
export class StorageBucketBag {
    constructor(props?: Partial<StorageBucketBag>) {
        Object.assign(this, props)
    }

    /**
     * {storageBucketId}-{storageBagId}
     */
    @PrimaryColumn_()
    id!: string

    @ManyToOne_(() => StorageBucket, {nullable: true, deferrable: 'INITIALLY DEFERRED'})
    storageBucket!: StorageBucket

    @Column_({ nullable: true })
    storageBucketId!: string | null | undefined

    @Index_()
    @ManyToOne_(() => StorageBag, {nullable: true, deferrable: 'INITIALLY DEFERRED'})
    bag!: StorageBag

    @Column_({ nullable: true })
    bagId!: string | null | undefined
}
