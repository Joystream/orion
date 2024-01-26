import express from 'express'

export const channelClicked = (_: unknown, res: express.Response) => {
  res.status(404).json({ empty: true })
}
