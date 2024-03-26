import mongoose from 'mongoose'
import { createLogger } from '@subsquid/logger'

const interactionsEmLogger = createLogger('interactionsEm')

export async function initInteractionsDb() {
  let instance: typeof mongoose | null = null
  try {
    interactionsEmLogger.info(`Initializing interactions database connection...`)
    instance = await mongoose.connect(
      `mongodb://${process.env.DB_NAME}:${process.env.DB_PASS}@interactions_db:${process.env.INTERACTIONS_DB_PORT}/interactions?authSource=admin`,
      {
        family: 4,
      }
    )
    interactionsEmLogger.info(`Connected to interactions database`)
  } catch (e) {
    interactionsEmLogger.error(
      `Error during interactions database connection initialization: ${String(e)}`
    )
    process.exit(-1) // Exit to trigger docker service restart an re-attempt to connect
  }
  return instance
}

const PurchaseModel = mongoose.model(
  'Purchase',
  new mongoose.Schema({
    itemId: String,
    timestamp: Date,
    userId: String,
  })
)

const RatingModel = mongoose.model(
  'Rating',
  new mongoose.Schema({
    itemId: String,
    timestamp: Date,
    rating: Number,
    userId: String,
  })
)

const DetailViewModel = mongoose.model(
  'DetailView',
  new mongoose.Schema({
    itemId: String,
    timestamp: Date,
    duration: Number,
    userId: String,
  })
)

const VideoPortionModel = mongoose.model(
  'VideoPortion',
  new mongoose.Schema({
    itemId: String,
    timestamp: Date,
    portion: Number,
    userId: String,
  })
)

export { PurchaseModel, RatingModel, DetailViewModel, VideoPortionModel }
