import ffmpeg, { FfmpegCommand } from 'fluent-ffmpeg'
import path from 'path'

// Define input and output file paths
const inputFilePath: string = path.join(__dirname, 'input.mp4')
const outputFilePath: string = path.join(__dirname, 'output.avi')

// Interface for FFmpeg progress information
interface FfmpegProgress {
  percent: number
}

// Function to transcode the video
function transcodeVideo(input: string, output: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const command: FfmpegCommand = ffmpeg(input)
      .output(output)
      .on('start', (commandLine: string) => {
        console.log('Spawned FFmpeg with command: ' + commandLine)
      })
      .on('progress', (progress: FfmpegProgress) => {
        console.log(`Processing: ${progress.percent.toFixed(2)}% done`)
      })
      .on('error', (err: Error, stdout: string, stderr: string) => {
        console.log('Error occurred: ' + err.message)
        console.log('FFmpeg stderr: ' + stderr)
        reject(err)
      })
      .on('end', () => {
        console.log('Transcoding finished successfully')
        resolve()
      })

    // Run the command

    command
      .videoCodec('libx264')
      .audioCodec('aac')
      .videoBitrate('1000k')
      .audioBitrate('128k')
      .size('640x480')
      .run()
  })
}

// Execute transcoding
transcodeVideo(inputFilePath, outputFilePath)
  .then(() => {
    console.log('Transcoding completed successfully')
  })
  .catch((error: Error) => {
    console.error('Error during transcoding:', error)
  })
