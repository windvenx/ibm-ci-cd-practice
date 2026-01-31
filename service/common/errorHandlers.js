/**
 * Error Handlers Module
 *
 * Copyright 2016, 2022 John J. Rofrano. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const status = require('./status')
const logger = require('./logger')

/**
 * Handle 404 Not Found errors
 */
const notFound = (req, res, next) => {
  const message = `Resource not found: ${req.method} ${req.path}`
  logger.warn(message)

  res.status(status.HTTP_404_NOT_FOUND).json({
    status: status.HTTP_404_NOT_FOUND,
    error: 'Not Found',
    message
  })
}

/**
 * General error handler
 */
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || status.HTTP_500_INTERNAL_SERVER_ERROR
  const message = err.message || 'Internal Server Error'
  let errorType = 'Internal Server Error'

  // Handle specific error types
  switch (statusCode) {
    case status.HTTP_400_BAD_REQUEST:
      errorType = 'Bad Request'
      logger.warn(message)
      break
    case status.HTTP_401_UNAUTHORIZED:
      errorType = 'Unauthorized'
      logger.warn(message)
      break
    case status.HTTP_403_FORBIDDEN:
      errorType = 'Forbidden'
      logger.warn(message)
      break
    case status.HTTP_404_NOT_FOUND:
      errorType = 'Not Found'
      logger.warn(message)
      break
    case status.HTTP_405_METHOD_NOT_ALLOWED:
      errorType = 'Method Not Allowed'
      logger.warn(message)
      break
    case status.HTTP_409_CONFLICT:
      errorType = 'Conflict'
      logger.warn(message)
      break
    case status.HTTP_415_UNSUPPORTED_MEDIA_TYPE:
      errorType = 'Unsupported Media Type'
      logger.warn(message)
      break
    case status.HTTP_500_INTERNAL_SERVER_ERROR:
    default:
      errorType = 'Internal Server Error'
      logger.error(message)
      logger.error(err.stack)
      break
  }

  res.status(statusCode).json({
    status: statusCode,
    error: errorType,
    message
  })
}

module.exports = {
  notFound,
  errorHandler
}
