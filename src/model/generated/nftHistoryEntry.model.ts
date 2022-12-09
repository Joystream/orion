import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import {OwnedNft} from "./ownedNft.model"
import {Event} from "./event.model"

@Entity_()
export class NftHistoryEntry {
    constructor(props?: Partial<NftHistoryEntry>) {
        Object.assign(this, props)
    }

    /**
     * Autoincremented
     */
    @PrimaryColumn_()
    id!: string

    /**
     * The NFT the event relates to
     */
    @Index_()
    @ManyToOne_(() => OwnedNft, {nullable: true, deferrable: 'INITIALLY DEFERRED'})
    nft!: OwnedNft

    @Column_({ nullable: true })
    nftId!: string | null | undefined

    /**
     * Nft-related event
     */
    @Index_()
    @ManyToOne_(() => Event, {nullable: true, deferrable: 'INITIALLY DEFERRED'})
    event!: Event

    @Column_({ nullable: true })
    eventId!: string | null | undefined
}
