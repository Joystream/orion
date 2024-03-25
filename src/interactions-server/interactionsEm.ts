import mongoose from 'mongoose'
import { createLogger } from '@subsquid/logger'

const interactionsEmLogger = createLogger('interactionsEm')

async function initInteractionsDb() {
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

// eslint-disable-next-line no-void
void initInteractionsDb()

const InteractionsModel = mongoose.model(
  'Interaction',
  new mongoose.Schema(
    {
      type: String,
      itemId: String,
      timestamp: Date,
    },
    { strict: false }
  )
)

export { InteractionsModel }
