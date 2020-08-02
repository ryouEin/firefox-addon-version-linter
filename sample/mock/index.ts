import { Request, Response } from 'express'

const express = require('express')
const app = express()
const port = 3000

app.get('/hogehoge/:version/file', (req: Request, res: Response) => {
  res.send('success')
})

app.listen(port, () => {
  console.log(`Mock listening at http://localhost:${port}`)
})
