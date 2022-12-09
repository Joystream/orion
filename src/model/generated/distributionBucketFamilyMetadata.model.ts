import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Unique as Unique_, OneToOne as OneToOne_, Index as Index_, JoinColumn as JoinColumn_} from "typeorm"
import * as marshal from "./marshal"
import {DistributionBucketFamily} from "./distributionBucketFamily.model"
import {GeographicalArea, fromJsonGeographicalArea} from "./_geographicalArea"

@Unique_('DistributionBucketFamilyMetadata_family', ["family"], {  deferrable: 'INITIALLY DEFERRED' })
@Entity_()
export class DistributionBucketFamilyMetadata {
    constructor(props?: Partial<DistributionBucketFamilyMetadata>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    /**
     * Distribution bucket family
     */
    @Index_()
    @OneToOne_(() => DistributionBucketFamily, {nullable: false, deferrable: 'INITIALLY DEFERRED'})
    @JoinColumn_()
    family!: DistributionBucketFamily

    @Column_()
    familyId!: string

    /**
     * Name of the geographical region covered by the family (ie.: us-east-1)
     */
    @Index_()
    @Column_("text", {nullable: true})
    region!: string | undefined | null

    /**
     * Optional, more specific description of the region covered by the family
     */
    @Column_("text", {nullable: true})
    description!: string | undefined | null

    /**
     * Geographical areas covered by the family
     */
    @Column_("jsonb", {transformer: {to: obj => obj == null ? undefined : obj.map((val: any) => val.toJSON()), from: obj => obj == null ? undefined : marshal.fromList(obj, val => fromJsonGeographicalArea(val))}, nullable: true})
    areas!: (GeographicalArea)[] | undefined | null

    /**
     * List of targets (hosts/ips) best suited latency measurements for the family
     */
    @Column_("text", {array: true, nullable: true})
    latencyTestTargets!: (string | undefined | null)[] | undefined | null
}
