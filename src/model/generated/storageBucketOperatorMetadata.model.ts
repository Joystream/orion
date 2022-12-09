import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Unique as Unique_, OneToOne as OneToOne_, Index as Index_, JoinColumn as JoinColumn_} from "typeorm"
import * as marshal from "./marshal"
import {StorageBucket} from "./storageBucket.model"
import {NodeLocationMetadata} from "./_nodeLocationMetadata"

@Unique_('StorageBucketOperatorMetadata_storageBucket', ["storageBucket"], {  deferrable: 'INITIALLY DEFERRED' })
@Entity_()
export class StorageBucketOperatorMetadata {
    constructor(props?: Partial<StorageBucketOperatorMetadata>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    /**
     * Storage bucket to which the metadata is assigned
     */
    @Index_()
    @OneToOne_(() => StorageBucket, {nullable: false, deferrable: 'INITIALLY DEFERRED'})
    @JoinColumn_()
    storageBucket!: StorageBucket

    @Column_()
    storageBucketId!: string

    /**
     * Root node endpoint
     */
    @Column_("text", {nullable: true})
    nodeEndpoint!: string | undefined | null

    /**
     * Optional node location metadata
     */
    @Column_("jsonb", {transformer: {to: obj => obj == null ? undefined : obj.toJSON(), from: obj => obj == null ? undefined : new NodeLocationMetadata(undefined, obj)}, nullable: true})
    nodeLocation!: NodeLocationMetadata | undefined | null

    /**
     * Additional information about the node/operator
     */
    @Column_("text", {nullable: true})
    extra!: string | undefined | null
}
