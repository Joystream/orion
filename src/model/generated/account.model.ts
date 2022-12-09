import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Unique as Unique_, OneToOne as OneToOne_, Index as Index_, JoinColumn as JoinColumn_} from "typeorm"
import {User} from "./user.model"
import {Membership} from "./membership.model"

/**
 * A Gateway Account
 */
@Unique_('Account_user', ["user"], {  deferrable: 'INITIALLY DEFERRED' })
@Unique_('Account_email', ["email"], {  deferrable: 'INITIALLY DEFERRED' })
@Unique_('Account_membership', ["membership"], {  deferrable: 'INITIALLY DEFERRED' })
@Unique_('Account_joystreamAccount', ["joystreamAccount"], {  deferrable: 'INITIALLY DEFERRED' })
@Entity_()
export class Account {
    constructor(props?: Partial<Account>) {
        Object.assign(this, props)
    }

    /**
     * Unique identifier (can be sequential)
     */
    @PrimaryColumn_()
    id!: string

    /**
     * The user associated with the gateway account (the Gateway Account Owner)
     */
    @Index_()
    @OneToOne_(() => User, {nullable: false, deferrable: 'INITIALLY DEFERRED'})
    @JoinColumn_()
    user!: User

    @Column_()
    userId!: string

    /**
     * Gateway account's e-mail address
     */
    @Index_()
    @Column_("text", {nullable: false})
    email!: string

    /**
     * Indicates whether the gateway account's e-mail has been confirmed or not.
     */
    @Column_("bool", {nullable: false})
    isEmailConfirmed!: boolean

    /**
     * Indicates whether the access to the gateway account is blocked
     */
    @Column_("bool", {nullable: false})
    isBlocked!: boolean

    /**
     * Time when the gateway account was registered
     */
    @Column_("timestamp with time zone", {nullable: false})
    registeredAt!: Date

    /**
     * On-chain membership associated with the gateway account
     */
    @Index_()
    @OneToOne_(() => Membership, {nullable: false, deferrable: 'INITIALLY DEFERRED'})
    @JoinColumn_()
    membership!: Membership

    @Column_()
    membershipId!: string

    /**
     * Blockchain (joystream) account associated with the gateway account
     */
    @Index_()
    @Column_("text", {nullable: false})
    joystreamAccount!: string
}
