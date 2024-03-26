import { ApiClient, requests } from 'recombee-api-client'
import { RSVideo } from '../utils/RecommendationServiceManager'
import dotenv from 'dotenv'

type RecombeePropTypes =
  | 'int'
  | 'double'
  | 'string'
  | 'boolean'
  | 'timestamp'
  | 'set'
  | 'image'
  | 'imageList'

type JoinedItemProps = keyof RSVideo

const itemPropToType: Record<JoinedItemProps, RecombeePropTypes> = {
  title: 'string',
  channel_title: 'string',
  timestamp: 'timestamp',
  language: 'string',
  channel_description: 'string',
  reactions_count: 'int',
  category_id: 'string',
  comments_count: 'int',
  views_num: 'int',
  channel_id: 'string',
  duration: 'int',
}

async function main() {
  dotenv.config()

  if (
    !process.env.RECOMMENDATION_SERVICE_PRIVATE_KEY ||
    !process.env.RECOMMENDATION_SERVICE_DATABASE
  ) {
    console.error('Missing required variables for setting up Recombee. Skipping...')
    process.exit(1)
  }

  const client = new ApiClient(
    process.env.RECOMMENDATION_SERVICE_DATABASE,
    process.env.RECOMMENDATION_SERVICE_PRIVATE_KEY,
    {
      region: 'eu-west',
    }
  )
  // setup item properties
  const itemPropertiesReqs = Object.entries(itemPropToType).map(
    ([propName, type]) => new requests.AddItemProperty(propName, type)
  )

  // setup segments
  const segmentsReqs = new requests.CreatePropertyBasedSegmentation(
    'channel-segmentation',
    'items',
    'channel_id'
  )

  const res = await client.send(new requests.Batch([...itemPropertiesReqs, segmentsReqs]))
  const failedRequests = res.filter((req) => req.code === 400)

  if (failedRequests.length) {
    console.error('Some of the requests failed! Recommbee is not ready to be used.', failedRequests)
    throw new Error()
  }
  console.log(
    'Recombee setup is completed! Rember to add following scenarios to the admin UI: watch-next, similar-videos, homepage'
  )
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e)
    process.exit(-1)
  })
