import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import {TokenType} from "./_tokenType"
import {Account} from "./account.model"

@Entity_()
export class Token {
    constructor(props?: Partial<Token>) {
        Object.assign(this, props)
    }

    /**
     * The token itself (32-byte string, securely random)
     */
    @PrimaryColumn_()
    id!: string

    /**
     * Type of the token (its intended purpose)
     */
    @Column_("varchar", {length: 18, nullable: false})
    type!: TokenType

    /**
     * When was the token issued
     */
    @Column_("timestamp with time zone", {nullable: false})
    issuedAt!: Date

    /**
     * When does the token expire or when has it expired
     */
    @Column_("timestamp with time zone", {nullable: false})
    expiry!: Date

    /**
     * The account the token was issued for
     */
    @Index_()
    @ManyToOne_(() => Account, {nullable: true, deferrable: 'INITIALLY DEFERRED'})
    issuedFor!: Account

    @Column_({ nullable: true })
    issuedForId!: string | null | undefined
}
