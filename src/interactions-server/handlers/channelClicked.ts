import express from 'express'

export const channelClicked = (_: unknown, res: express.Response) => {
  res.status(200).json({ success: true })
}
