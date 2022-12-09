import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Unique as Unique_, OneToOne as OneToOne_, Index as Index_, JoinColumn as JoinColumn_} from "typeorm"
import {Account} from "./account.model"

@Unique_('EncryptionArtifacts_account', ["account"], {  deferrable: 'INITIALLY DEFERRED' })
@Entity_()
export class EncryptionArtifacts {
    constructor(props?: Partial<EncryptionArtifacts>) {
        Object.assign(this, props)
    }

    /**
     * ID / lookupKey
     */
    @PrimaryColumn_()
    id!: string

    /**
     * The account the encryption artifacts are associated with
     */
    @Index_()
    @OneToOne_(() => Account, {nullable: false, deferrable: 'INITIALLY DEFERRED'})
    @JoinColumn_()
    account!: Account

    @Column_()
    accountId!: string

    /**
     * The IV used to encrypt the wallet seed with user credentials
     */
    @Column_("text", {nullable: false})
    cipherIv!: string

    /**
     * Wallet seed encrypted with user credentials
     */
    @Column_("text", {nullable: false})
    encryptedSeed!: string
}
