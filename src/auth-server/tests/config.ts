import { config as dontenvConfig } from 'dotenv'
import path from 'path'

dontenvConfig({
  path: path.resolve(__dirname, '../../../.env'),
})
