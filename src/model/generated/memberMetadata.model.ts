import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Unique as Unique_, OneToOne as OneToOne_, Index as Index_, JoinColumn as JoinColumn_} from "typeorm"
import * as marshal from "./marshal"
import {Avatar, fromJsonAvatar} from "./_avatar"
import {Membership} from "./membership.model"

@Unique_('MemberMetadata_member', ["member"], {  deferrable: 'INITIALLY DEFERRED' })
@Entity_()
export class MemberMetadata {
    constructor(props?: Partial<MemberMetadata>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    /**
     * Member's name
     */
    @Column_("text", {nullable: true})
    name!: string | undefined | null

    /**
     * Avatar data object
     */
    @Column_("jsonb", {transformer: {to: obj => obj == null ? undefined : obj.toJSON(), from: obj => obj == null ? undefined : fromJsonAvatar(obj)}, nullable: true})
    avatar!: Avatar | undefined | null

    /**
     * Short text chosen by member to share information about themselves
     */
    @Column_("text", {nullable: true})
    about!: string | undefined | null

    @Index_()
    @OneToOne_(() => Membership, {nullable: false, deferrable: 'INITIALLY DEFERRED'})
    @JoinColumn_()
    member!: Membership

    @Column_()
    memberId!: string
}
