// import featuredContentJson from './data/featuredContent.json'
import reportedChannelsJson from './data/reportedChannels.json'
import reportedVideosJson from './data/reportedVideos.json'
import videoEventsJson from './data/videoEvents.json'
import { Report, VideoViewEvent } from '../../src/model'
import { stringify } from 'csv-stringify/sync'
import fs from 'fs'
import path from 'path'
import { randomAsHex } from '@polkadot/util-crypto'

const OUTPUT_PATH = path.join(__dirname, '../../db/persisted')

// type FeaturedContent = {
//   featuredVideosPerCategory: {
//     [categoryId: string]: {
//       videoId: string
//       videoCutUrl: string
//     }[]
//   }
//   videoHero: {
//     videoId: string
//     heroTitle: string
//     heroVideoCutUrl: string
//     heroPosterUrl: string
//   }
// }

type ReportedContent = { reporterIp: string; timestamp: { $date: string }; rationale: string }
type ReportedChannel = ReportedContent & {
  channelId: string
}

type ReportedVideo = ReportedContent & {
  videoId: string
}

type VideoEvent = {
  videoId: string
  channelId: string
  timestamp: { $date: string }
  actorId: string
  type: string
}

const reportedChannels: ReportedChannel[] = reportedChannelsJson
const reportedVideos: ReportedVideo[] = reportedVideosJson
const videoEvents: VideoEvent[] = videoEventsJson

console.log('Preparing Orion v1 data for import...')

const reports = [...reportedChannels, ...reportedVideos].map(
  (rc) =>
    new Report({
      id: randomAsHex(16).replace('0x', ''),
      channelId: 'channelId' in rc ? rc.channelId : undefined,
      videoId: 'videoId' in rc ? rc.videoId : undefined,
      ip: rc.reporterIp,
      rationale: rc.rationale,
      timestamp: new Date(rc.timestamp.$date),
    })
)

let views = videoEvents
  .filter((e) => e.type === 'ADD_VIEW')
  .map(
    (v) =>
      new VideoViewEvent({
        ip: v.actorId,
        timestamp: new Date(v.timestamp.$date),
        videoId: v.videoId,
      })
  )
  .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())

if (process.env.EXCLUDE_DUPLICATE_VIEWS === 'true' && process.env.VIDEO_VIEW_PER_IP_TIME_LIMIT) {
  const timeLimitMs = parseInt(process.env.VIDEO_VIEW_PER_IP_TIME_LIMIT) * 1000
  const viewsReduced = views.reduce((reduced, v) => {
    return !reduced.find(
      (vr) =>
        vr.timestamp.getTime() > v.timestamp.getTime() - timeLimitMs &&
        vr.ip === v.ip &&
        vr.videoId === v.videoId
    )
      ? reduced.concat(v)
      : reduced
  }, [] as VideoViewEvent[])
  views = viewsReduced
}

views.forEach((v, i) => {
  v.id = `${v.videoId}-${views.slice(0, i).filter((v2) => v2.videoId === v.videoId).length + 1}`
})

const viewColumns: (keyof VideoViewEvent)[] = ['id', 'videoId', 'ip', 'timestamp']
const reportColumns: (keyof Report)[] = [
  'id',
  'ip',
  'channelId',
  'videoId',
  'timestamp',
  'rationale',
]

fs.writeFileSync(
  `${OUTPUT_PATH}/video_view_event`,
  stringify(views, { columns: viewColumns, cast: { date: (d) => d.toISOString() } })
)
console.log(
  `${views.length} video views saved to "${OUTPUT_PATH}/video_view_event". ` +
    `Will be imported during Orion v2 migration step.`
)
fs.writeFileSync(
  `${OUTPUT_PATH}/report`,
  stringify(reports, { columns: reportColumns, cast: { date: (d) => d.toISOString() } })
)
console.log(
  `${reports.length} reports saved to "${OUTPUT_PATH}/report". ` +
    `Will be imported during Orion v2 migration step.`
)
