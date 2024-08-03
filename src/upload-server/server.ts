import { S3Store } from '@tus/s3-store'
import { Server } from '@tus/server'
import express from 'express'

const s3Store = new S3Store({
  partSize: 8 * 1024 * 1024, // Each uploaded part will have ~8MiB,
  s3ClientConfig: {
    bucket: process.env.AWS_BUCKET || '',
    region: process.env.AWS_REGION || '',
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    },
  },
})

const host = '127.0.0.1'
const port = 1080
const app = express()
const uploadApp = express()

const server = new Server({
  path: '/uploads',
  datastore: s3Store,
})

uploadApp.all('*', server.handle.bind(server))
app.use('/uploads', uploadApp)
app.listen(port, host)
console.log(`Server is running at http://${host}:${port}`)
