import { Entity, Column, ManyToOne, Index, PrimaryGeneratedColumn } from 'typeorm'
import { Video } from './generated'

@Entity()
export class VideoViewEvent {
  constructor(props?: Partial<VideoViewEvent>) {
    Object.assign(this, props)
  }

  @PrimaryGeneratedColumn('increment')
  id!: number

  // Video that was viewed
  @Index()
  @ManyToOne(() => Video, { nullable: true, onDelete: 'CASCADE' })
  video!: Video

  // IP of the viewer
  @Index()
  @Column({ nullable: false })
  ip!: string

  // View timestamp
  @Column('timestamp with time zone', { nullable: false })
  timestamp!: Date
}
