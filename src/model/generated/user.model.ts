import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, OneToMany as OneToMany_} from "typeorm"
import {Account} from "./account.model"
import {ChannelFollow} from "./channelFollow.model"
import {VideoViewEvent} from "./videoViewEvent.model"
import {Report} from "./report.model"
import {NftFeaturingRequest} from "./nftFeaturingRequest.model"

@Entity_()
export class User {
    constructor(props?: Partial<User>) {
        Object.assign(this, props)
    }

    /**
     * Unique identifier (32-byte string, securely random)
     */
    @PrimaryColumn_()
    id!: string

    /**
     * Whether the user has root (gateway operator) privileges
     */
    @Column_("bool", {nullable: false})
    isRoot!: boolean

    /**
     * The account associated with the user (if any)
     */

    /**
     * User's channel follows
     */
    @OneToMany_(() => ChannelFollow, e => e.user)
    channelFollows!: ChannelFollow[]

    /**
     * Video views associated with the user
     */
    @OneToMany_(() => VideoViewEvent, e => e.user)
    videoViewEvents!: VideoViewEvent[]

    /**
     * Reports associated with the user
     */
    @OneToMany_(() => Report, e => e.user)
    reports!: Report[]

    /**
     * NFT featuring requests associated with the user
     */
    @OneToMany_(() => NftFeaturingRequest, e => e.user)
    nftFeaturingRequests!: NftFeaturingRequest[]
}
