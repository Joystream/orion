import { Entity, Column, PrimaryColumn, Index } from 'typeorm'
import * as marshal from './generated/marshal'
import { TokenStatus } from './generated/_tokenStatus'
import { TokenAvatar, fromJsonTokenAvatar } from './generated/_tokenAvatar'

@Entity()
export class MarketplaceToken {
  constructor(props?: Partial<MarketplaceToken>) {
    Object.assign(this, props)
  }

  @Column('int4', { nullable: true })
  liquidity!: number | undefined | null

  @Column('numeric', { transformer: marshal.bigintTransformer, nullable: true })
  marketCap!: bigint | undefined | null

  @Column('numeric', { transformer: marshal.bigintTransformer, nullable: true })
  ammVolume!: bigint | undefined | null

  @Column('int4', { nullable: true })
  lastDayPriceChange!: number | undefined | null

  @Column('int4', { nullable: true })
  weeklyLiqChange!: number | undefined | null

  /**
   * runtime token identifier
   */
  @PrimaryColumn()
  id!: string

  /**
   * status sale / market / idle
   */
  @Column('varchar', { length: 6, nullable: false })
  status!: TokenStatus

  /**
   * avatar object (profile picture)
   */
  @Column('jsonb', {
    transformer: {
      to: (obj) => (obj == null ? undefined : obj.toJSON()),
      from: (obj) => (obj == null ? undefined : fromJsonTokenAvatar(obj)),
    },
    nullable: true,
  })
  avatar!: TokenAvatar | undefined | null

  /**
   * total supply
   */
  @Column('numeric', { transformer: marshal.bigintTransformer, nullable: false })
  totalSupply!: bigint

  /**
   * Flag to indicate whether the CRT is featured or not
   */
  @Column('bool', { nullable: false })
  isFeatured!: boolean

  /**
   * symbol for the token uniqueness guaranteed by runtime
   */
  @Index()
  @Column('text', { nullable: true })
  symbol!: string | undefined | null

  /**
   * access status invite only vs anyone
   */
  @Column('bool', { nullable: false })
  isInviteOnly!: boolean

  /**
   * creator annual revenue (minted)
   */
  @Column('int4', { nullable: false })
  annualCreatorRewardPermill!: number

  /**
   * revenue share ratio between creator and holder
   */
  @Column('int4', { nullable: false })
  revenueShareRatioPermill!: number

  /**
   * date at which this token was created
   */
  @Index()
  @Column('timestamp with time zone', { nullable: false })
  createdAt!: Date

  /**
   * channel from which the token is issued uniqueness guaranteed by runtime
   */
  @Column('text', { nullable: true })
  channelId!: string | undefined | null

  /**
   * video for the token presentation page
   */
  @Column('text', { nullable: true })
  trailerVideoId!: string | undefined | null

  /**
   * about information displayed under the presentation video
   */
  @Column('text', { nullable: true })
  description!: string | undefined | null

  /**
   * note from creator to member interested in joining the whitelist
   */
  @Column('text', { nullable: true })
  whitelistApplicantNote!: string | undefined | null

  /**
   * link for creator to member interested in joining the whitelist
   */
  @Column('text', { nullable: true })
  whitelistApplicantLink!: string | undefined | null

  /**
   * number of accounts to avoid aggregate COUNT
   */
  @Column('int4', { nullable: false })
  accountsNum!: number

  /**
   * number of revenue shares issued
   */
  @Column('int4', { nullable: false })
  numberOfRevenueShareActivations!: number

  /**
   * whether it has been deissued or not
   */
  @Column('bool', { nullable: false })
  deissued!: boolean

  /**
   * current amm sale if ongoing
   */
  @Column('text', { nullable: true })
  currentAmmSaleId!: string | undefined | null

  /**
   * current sale if ongoing
   */
  @Column('text', { nullable: true })
  currentSaleId!: string | undefined | null

  /**
   * current revenue share if ongoing
   */
  @Column('text', { nullable: true })
  currentRevenueShareId!: string | undefined | null

  /**
   * number of vested transfer completed
   */
  @Column('int4', { nullable: false })
  numberOfVestedTransferIssued!: number

  /**
   * last unit price available
   */
  @Column('numeric', { transformer: marshal.bigintTransformer, nullable: true })
  lastPrice!: bigint | undefined | null
}
