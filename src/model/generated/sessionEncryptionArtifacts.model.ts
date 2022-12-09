import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Unique as Unique_, OneToOne as OneToOne_, Index as Index_, JoinColumn as JoinColumn_} from "typeorm"
import {Session} from "./session.model"

@Unique_('SessionEncryptionArtifacts_session', ["session"], {  deferrable: 'INITIALLY DEFERRED' })
@Entity_()
export class SessionEncryptionArtifacts {
    constructor(props?: Partial<SessionEncryptionArtifacts>) {
        Object.assign(this, props)
    }

    /**
     * Unique identifier
     */
    @PrimaryColumn_()
    id!: string

    /**
     * The session the encryption artifacts are associated with
     */
    @Index_()
    @OneToOne_(() => Session, {nullable: false, deferrable: 'INITIALLY DEFERRED'})
    @JoinColumn_()
    session!: Session

    @Column_()
    sessionId!: string

    /**
     * The IV used to encrypt the seed with cipherKey
     */
    @Column_("text", {nullable: false})
    cipherIv!: string

    /**
     * cipherKey used to encrypt the seed stored client-side for the duration of the session
     */
    @Column_("text", {nullable: false})
    cipherKey!: string
}
