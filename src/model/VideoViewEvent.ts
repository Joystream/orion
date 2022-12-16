import { Entity, Column, PrimaryColumn, ManyToOne, Index } from 'typeorm'
import { Video } from './generated'

@Entity()
export class VideoViewEvent {
  constructor(props?: Partial<VideoViewEvent>) {
    Object.assign(this, props)
  }

  // {videoId}-{viewNumber}
  @PrimaryColumn()
  id!: string

  // Video that was viewed
  @Index()
  @ManyToOne(() => Video, { nullable: true, onDelete: 'CASCADE' })
  video!: Video

  // IP of the viewer
  @Column({ nullable: false })
  ip!: string

  // View timestamp
  @Column('timestamp with time zone', { nullable: false })
  timestamp!: Date
}
