import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Unique as Unique_, Index as Index_, ManyToOne as ManyToOne_, OneToMany as OneToMany_} from "typeorm"
import {Membership} from "./membership.model"
import {Video} from "./video.model"
import {Channel} from "./channel.model"

@Unique_('App_name', ["name"], {  deferrable: 'INITIALLY DEFERRED' })
@Entity_()
export class App {
    constructor(props?: Partial<App>) {
        Object.assign(this, props)
    }

    /**
     * Runtime entity identifier (EntityId)
     */
    @PrimaryColumn_()
    id!: string

    /**
     * The name of the App
     */
    @Index_()
    @Column_("text", {nullable: false})
    name!: string

    /**
     * Member owning the App
     */
    @Index_()
    @ManyToOne_(() => Membership, {nullable: true, deferrable: 'INITIALLY DEFERRED'})
    ownerMember!: Membership

    @Column_({ nullable: true })
    ownerMemberId!: string | null | undefined

    /**
     * Url where user can read more about the project or company for this app
     */
    @Column_("text", {nullable: true})
    websiteUrl!: string | undefined | null

    /**
     * Url to the app
     */
    @Column_("text", {nullable: true})
    useUri!: string | undefined | null

    @Column_("text", {nullable: true})
    smallIcon!: string | undefined | null

    @Column_("text", {nullable: true})
    mediumIcon!: string | undefined | null

    @Column_("text", {nullable: true})
    bigIcon!: string | undefined | null

    /**
     * Tagline of the app
     */
    @Column_("text", {nullable: true})
    oneLiner!: string | undefined | null

    @Column_("text", {nullable: true})
    description!: string | undefined | null

    @Column_("text", {nullable: true})
    termsOfService!: string | undefined | null

    /**
     * List of platforms on which the app will be available, e.g. [mobile, web, native]
     */
    @Column_("text", {array: true, nullable: true})
    platforms!: (string | undefined | null)[] | undefined | null

    @Column_("text", {nullable: true})
    category!: string | undefined | null

    @Column_("text", {nullable: true})
    authKey!: string | undefined | null

    @OneToMany_(() => Video, e => e.entryApp)
    appVideos!: Video[]

    @OneToMany_(() => Channel, e => e.entryApp)
    appChannels!: Channel[]
}
