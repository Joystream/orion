import { Entity, Column, ManyToOne, Index, PrimaryGeneratedColumn } from 'typeorm'
import { Video } from './generated'
import { Channel } from './generated/channel.model'

@Entity()
export class Report {
  constructor(props?: Partial<Report>) {
    Object.assign(this, props)
  }

  @PrimaryGeneratedColumn('increment')
  id!: number

  // IP address of the reporter
  @Index()
  @Column({ nullable: false })
  ip!: string

  // Channel being reported (or channel that owns the video being reported)
  @Index()
  @ManyToOne(() => Channel, { nullable: false, onDelete: 'CASCADE' })
  channel!: Channel

  // Video being reported (if any)
  @Index()
  @ManyToOne(() => Video, { nullable: true, onDelete: 'CASCADE' })
  video!: Video

  // Time of the report
  @Column('timestamp with time zone', { nullable: false })
  timestamp!: Date

  // Rationale behind the report
  @Column({ nullable: false })
  rationale!: string
}
