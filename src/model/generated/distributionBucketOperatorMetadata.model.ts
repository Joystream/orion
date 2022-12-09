import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Unique as Unique_, OneToOne as OneToOne_, Index as Index_, JoinColumn as JoinColumn_} from "typeorm"
import * as marshal from "./marshal"
import {DistributionBucketOperator} from "./distributionBucketOperator.model"
import {NodeLocationMetadata} from "./_nodeLocationMetadata"

@Unique_('DistributionBucketOperatorMetadata_distirbutionBucketOperator', ["distirbutionBucketOperator"], {  deferrable: 'INITIALLY DEFERRED' })
@Entity_()
export class DistributionBucketOperatorMetadata {
    constructor(props?: Partial<DistributionBucketOperatorMetadata>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    /**
     * Distribution bucket operator
     */
    @Index_()
    @OneToOne_(() => DistributionBucketOperator, {nullable: false, deferrable: 'INITIALLY DEFERRED'})
    @JoinColumn_()
    distirbutionBucketOperator!: DistributionBucketOperator

    @Column_()
    distirbutionBucketOperatorId!: string

    /**
     * Root distributor node api endpoint
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
