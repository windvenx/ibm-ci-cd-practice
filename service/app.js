const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
require('dotenv').config()

const routes = require('./routes')
const errorHandlers = require('./common/errorHandlers')
const logger = require('./common/logger')

const app = express()
const PORT = process.env.PORT || 8000

// Middleware
app.use(helmet())
app.use(cors())
app.use(morgan('combined'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Initialize routes
app.use('/', routes)

// Error handling middleware
app.use(errorHandlers.notFound)
app.use(errorHandlers.errorHandler)

// Start server
if (require.main === module) {
  app.listen(PORT, '0.0.0.0', () => {
    logger.info('*'.repeat(70))
    logger.info('  S E R V I C E   R U N N I N G  '.padStart(35, '*').padEnd(70, '*'))
    logger.info('*'.repeat(70))
    logger.info(`Server running on http://0.0.0.0:${PORT}`)
  })
}

module.exports = app
