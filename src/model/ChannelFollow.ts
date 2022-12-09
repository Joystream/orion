import { Entity, Column, PrimaryColumn, ManyToOne, Index } from 'typeorm'
import { Channel } from './generated/channel.model'
import { User } from './User'

@Entity()
export class ChannelFollow {
  constructor(props?: Partial<ChannelFollow>) {
    Object.assign(this, props)
  }

  @PrimaryColumn()
  id!: string

  /**
   * Channel being followed
   */
  @Index()
  @ManyToOne(() => Channel, { nullable: true })
  channel!: Channel

  /**
   * User who followed
   */
  @Index()
  @ManyToOne(() => User, { nullable: true })
  user!: User

  /**
   * Timestamp
   */
  @Column('timestamp with time zone', { nullable: false })
  timestamp!: Date
}
