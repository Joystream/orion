import { Entity, PrimaryColumn, OneToMany } from 'typeorm'
import { ChannelFollow } from './ChannelFollow'

/**
 * Represents a generic Atlas User
 */
@Entity()
export class User {
  constructor(props?: Partial<User>) {
    Object.assign(this, props)
  }

  /**
   * Unique identifier
   */
  @PrimaryColumn()
  id!: string

  /**
   * Channels followed by the user
   */
  @OneToMany(() => ChannelFollow, (e) => e.user)
  followedChannels!: ChannelFollow[]
}
