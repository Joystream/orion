import { Entity, Column, ManyToOne, Index, PrimaryGeneratedColumn } from 'typeorm'
import { Channel } from './generated/channel.model'

@Entity()
export class ChannelFollow {
  constructor(props?: Partial<ChannelFollow>) {
    Object.assign(this, props)
  }

  @PrimaryGeneratedColumn('increment')
  id!: number

  // IP address of the user
  @Index()
  @Column({ nullable: false })
  ip!: string

  // Channel being followed
  @Index()
  @ManyToOne(() => Channel, { nullable: true })
  channel!: Channel

  // Time when user started following the channel
  @Column('timestamp with time zone', { nullable: false })
  timestamp!: Date

  // Token that has to be provided in order to unfollow the channel
  // (to prevent abuse / inconsistent state)
  @Column({ nullable: false })
  cancelToken!: string
}
