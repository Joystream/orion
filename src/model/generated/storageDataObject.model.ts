import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
import {StorageBag} from "./storageBag.model"
import {DataObjectType, fromJsonDataObjectType} from "./_dataObjectType"

@Entity_()
export class StorageDataObject {
    constructor(props?: Partial<StorageDataObject>) {
        Object.assign(this, props)
    }

    /**
     * Data object runtime id
     */
    @PrimaryColumn_()
    id!: string

    /**
     * Timestamp of the block the data object was created at
     */
    @Column_("timestamp with time zone", {nullable: false})
    createdAt!: Date

    /**
     * Whether the data object was uploaded and accepted by the storage provider
     */
    @Column_("bool", {nullable: false})
    isAccepted!: boolean

    /**
     * Data object size in bytes
     */
    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    size!: bigint

    /**
     * Storage bag the data object is part of
     */
    @Index_()
    @ManyToOne_(() => StorageBag, {nullable: true, deferrable: 'INITIALLY DEFERRED'})
    storageBag!: StorageBag

    @Column_({ nullable: true })
    storageBagId!: string | null | undefined

    /**
     * IPFS content hash
     */
    @Column_("text", {nullable: false})
    ipfsHash!: string

    /**
     * The type of the asset that the data object represents (if known)
     */
    @Column_("jsonb", {transformer: {to: obj => obj == null ? undefined : obj.toJSON(), from: obj => obj == null ? undefined : fromJsonDataObjectType(obj)}, nullable: true})
    type!: DataObjectType | undefined | null

    /**
     * State Bloat Bond for removing the data object
     */
    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    stateBloatBond!: bigint

    /**
     * If the object is no longer used as an asset - the time at which it was unset (if known)
     */
    @Column_("timestamp with time zone", {nullable: true})
    unsetAt!: Date | undefined | null

    /**
     * Resolved asset urls
     */
    @Column_("text", {array: true, nullable: false})
    resolvedUrls!: (string)[]
}
