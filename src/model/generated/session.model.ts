import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import {User} from "./user.model"
import {Account} from "./account.model"

@Entity_()
export class Session {
    constructor(props?: Partial<Session>) {
        Object.assign(this, props)
    }

    /**
     * Unique identifier (32-byte string, securely random)
     */
    @PrimaryColumn_()
    id!: string

    /**
     * Browser (as deterimned based on user-agent header)
     */
    @Column_("text", {nullable: false})
    browser!: string

    /**
     * Operating system (as deterimned based on user-agent header)
     */
    @Column_("text", {nullable: false})
    os!: string

    /**
     * Device (as deterimned based on user-agent header)
     */
    @Column_("text", {nullable: false})
    device!: string

    /**
     * Device type (as deterimned based on user-agent header)
     */
    @Column_("text", {nullable: true})
    deviceType!: string | undefined | null

    /**
     * User associated with the session
     */
    @Index_()
    @ManyToOne_(() => User, {nullable: true, deferrable: 'INITIALLY DEFERRED'})
    user!: User

    @Column_({ nullable: true })
    userId!: string | null | undefined

    /**
     * Account associated with the session (if any)
     */
    @Index_()
    @ManyToOne_(() => Account, {nullable: true, deferrable: 'INITIALLY DEFERRED'})
    account!: Account | undefined | null

    @Column_({ nullable: true })
    accountId!: string | null | undefined

    /**
     * IP address associated with the session
     */
    @Index_()
    @Column_("text", {nullable: false})
    ip!: string

    /**
     * Time when the session started
     */
    @Column_("timestamp with time zone", {nullable: false})
    startedAt!: Date

    /**
     * Time when the session expires or did expire
     */
    @Column_("timestamp with time zone", {nullable: false})
    expiry!: Date
}
