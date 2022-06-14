import express from 'express'

import EventsRouter from './events.mjs'

const router = express.Router()

router.use('/events', EventsRouter)

export default router