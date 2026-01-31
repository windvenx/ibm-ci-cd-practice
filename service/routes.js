const express = require('express')
const router = express.Router()
const status = require('./common/status')
const logger = require('./common/logger')

// In-memory counter storage
let COUNTER = {}

/**
 * Health Endpoint
 */
router.get('/health', (req, res) => {
  res.status(status.HTTP_200_OK).json({ status: 'OK' })
})

/**
 * Index page
 */
router.get('/', (req, res) => {
  logger.info('Request for Base URL')
  res.status(status.HTTP_200_OK).json({
    status: status.HTTP_200_OK,
    message: 'Hit Counter Service',
    version: '1.0.0',
    url: `${req.protocol}://${req.get('host')}/counters`
  })
})

/**
 * List all counters
 */
router.get('/counters', (req, res) => {
  logger.info('Request to list all counters...')

  const counters = Object.entries(COUNTER).map(([name, counter]) => ({
    name,
    counter
  }))

  res.status(status.HTTP_200_OK).json(counters)
})

/**
 * Create a new counter
 */
router.post('/counters/:name', (req, res) => {
  const { name } = req.params
  logger.info(`Request to Create counter: ${name}...`)

  if (name in COUNTER) {
    return res.status(status.HTTP_409_CONFLICT).json({
      status: status.HTTP_409_CONFLICT,
      error: 'Conflict',
      message: `Counter ${name} already exists`
    })
  }

  COUNTER[name] = 0

  const locationUrl = `${req.protocol}://${req.get('host')}/counters/${name}`
  res.status(status.HTTP_201_CREATED)
    .location(locationUrl)
    .json({ name, counter: 0 })
})

/**
 * Read a single counter
 */
router.get('/counters/:name', (req, res) => {
  const { name } = req.params
  logger.info(`Request to Read counter: ${name}...`)

  if (!(name in COUNTER)) {
    return res.status(status.HTTP_404_NOT_FOUND).json({
      status: status.HTTP_404_NOT_FOUND,
      error: 'Not Found',
      message: `Counter ${name} does not exist`
    })
  }

  const counter = COUNTER[name]
  res.status(status.HTTP_200_OK).json({ name, counter })
})

/**
 * Update a counter (increment by 1)
 */
router.put('/counters/:name', (req, res) => {
  const { name } = req.params
  logger.info(`Request to Update counter: ${name}...`)

  if (!(name in COUNTER)) {
    return res.status(status.HTTP_404_NOT_FOUND).json({
      status: status.HTTP_404_NOT_FOUND,
      error: 'Not Found',
      message: `Counter ${name} does not exist`
    })
  }

  COUNTER[name] += 1
  const counter = COUNTER[name]

  res.status(status.HTTP_200_OK).json({ name, counter })
})

/**
 * Delete a counter
 */
router.delete('/counters/:name', (req, res) => {
  const { name } = req.params
  logger.info(`Request to Delete counter: ${name}...`)

  if (name in COUNTER) {
    delete COUNTER[name]
  }

  res.status(status.HTTP_204_NO_CONTENT).send()
})

/**
 * Utility function for testing - reset all counters
 */
function resetCounters () {
  if (process.env.NODE_ENV === 'test') {
    COUNTER = {}
  }
}

module.exports = router
module.exports.resetCounters = resetCounters
