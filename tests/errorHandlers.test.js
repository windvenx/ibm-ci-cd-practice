/**
 * Error Handlers Test Suite
 */

const errorHandlers = require('../service/common/errorHandlers')
const status = require('../service/common/status')
const logger = require('../service/common/logger')

// Mock the logger to avoid console output during tests
jest.mock('../service/common/logger', () => ({
  warn: jest.fn(),
  error: jest.fn()
}))

describe('Error Handlers', () => {
  let req, res, next

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks()

    // Mock Express request and response objects
    req = {
      method: 'GET',
      path: '/test'
    }

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    }

    next = jest.fn()
  })

  describe('notFound', () => {
    it('should return 404 with correct error message', () => {
      // Call the handler
      errorHandlers.notFound(req, res, next)

      // Check that logger was called
      expect(logger.warn).toHaveBeenCalledWith('Resource not found: GET /test')

      // Check response
      expect(res.status).toHaveBeenCalledWith(status.HTTP_404_NOT_FOUND)
      expect(res.json).toHaveBeenCalledWith({
        status: status.HTTP_404_NOT_FOUND,
        error: 'Not Found',
        message: 'Resource not found: GET /test'
      })
    })
  })

  describe('errorHandler', () => {
    it('should handle 400 Bad Request errors', () => {
      const err = {
        statusCode: status.HTTP_400_BAD_REQUEST,
        message: 'Bad request error'
      }

      errorHandlers.errorHandler(err, req, res, next)

      expect(logger.warn).toHaveBeenCalledWith('Bad request error')
      expect(res.status).toHaveBeenCalledWith(status.HTTP_400_BAD_REQUEST)
      expect(res.json).toHaveBeenCalledWith({
        status: status.HTTP_400_BAD_REQUEST,
        error: 'Bad Request',
        message: 'Bad request error'
      })
    })

    it('should handle 401 Unauthorized errors', () => {
      const err = {
        statusCode: status.HTTP_401_UNAUTHORIZED,
        message: 'Unauthorized error'
      }

      errorHandlers.errorHandler(err, req, res, next)

      expect(logger.warn).toHaveBeenCalledWith('Unauthorized error')
      expect(res.status).toHaveBeenCalledWith(status.HTTP_401_UNAUTHORIZED)
      expect(res.json).toHaveBeenCalledWith({
        status: status.HTTP_401_UNAUTHORIZED,
        error: 'Unauthorized',
        message: 'Unauthorized error'
      })
    })

    it('should handle 403 Forbidden errors', () => {
      const err = {
        statusCode: status.HTTP_403_FORBIDDEN,
        message: 'Forbidden error'
      }

      errorHandlers.errorHandler(err, req, res, next)

      expect(logger.warn).toHaveBeenCalledWith('Forbidden error')
      expect(res.status).toHaveBeenCalledWith(status.HTTP_403_FORBIDDEN)
      expect(res.json).toHaveBeenCalledWith({
        status: status.HTTP_403_FORBIDDEN,
        error: 'Forbidden',
        message: 'Forbidden error'
      })
    })

    it('should handle 404 Not Found errors', () => {
      const err = {
        statusCode: status.HTTP_404_NOT_FOUND,
        message: 'Not found error'
      }

      errorHandlers.errorHandler(err, req, res, next)

      expect(logger.warn).toHaveBeenCalledWith('Not found error')
      expect(res.status).toHaveBeenCalledWith(status.HTTP_404_NOT_FOUND)
      expect(res.json).toHaveBeenCalledWith({
        status: status.HTTP_404_NOT_FOUND,
        error: 'Not Found',
        message: 'Not found error'
      })
    })

    it('should handle 405 Method Not Allowed errors', () => {
      const err = {
        statusCode: status.HTTP_405_METHOD_NOT_ALLOWED,
        message: 'Method not allowed error'
      }

      errorHandlers.errorHandler(err, req, res, next)

      expect(logger.warn).toHaveBeenCalledWith('Method not allowed error')
      expect(res.status).toHaveBeenCalledWith(status.HTTP_405_METHOD_NOT_ALLOWED)
      expect(res.json).toHaveBeenCalledWith({
        status: status.HTTP_405_METHOD_NOT_ALLOWED,
        error: 'Method Not Allowed',
        message: 'Method not allowed error'
      })
    })

    it('should handle 409 Conflict errors', () => {
      const err = {
        statusCode: status.HTTP_409_CONFLICT,
        message: 'Conflict error'
      }

      errorHandlers.errorHandler(err, req, res, next)

      expect(logger.warn).toHaveBeenCalledWith('Conflict error')
      expect(res.status).toHaveBeenCalledWith(status.HTTP_409_CONFLICT)
      expect(res.json).toHaveBeenCalledWith({
        status: status.HTTP_409_CONFLICT,
        error: 'Conflict',
        message: 'Conflict error'
      })
    })

    it('should handle 415 Unsupported Media Type errors', () => {
      const err = {
        statusCode: status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
        message: 'Unsupported media type error'
      }

      errorHandlers.errorHandler(err, req, res, next)

      expect(logger.warn).toHaveBeenCalledWith('Unsupported media type error')
      expect(res.status).toHaveBeenCalledWith(status.HTTP_415_UNSUPPORTED_MEDIA_TYPE)
      expect(res.json).toHaveBeenCalledWith({
        status: status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
        error: 'Unsupported Media Type',
        message: 'Unsupported media type error'
      })
    })

    it('should handle 500 Internal Server Error', () => {
      const err = {
        statusCode: status.HTTP_500_INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
        stack: 'Error stack trace'
      }

      errorHandlers.errorHandler(err, req, res, next)

      expect(logger.error).toHaveBeenCalledWith('Internal server error')
      expect(logger.error).toHaveBeenCalledWith('Error stack trace')
      expect(res.status).toHaveBeenCalledWith(status.HTTP_500_INTERNAL_SERVER_ERROR)
      expect(res.json).toHaveBeenCalledWith({
        status: status.HTTP_500_INTERNAL_SERVER_ERROR,
        error: 'Internal Server Error',
        message: 'Internal server error'
      })
    })

    it('should handle errors without statusCode as 500', () => {
      const err = {
        message: 'Unknown error',
        stack: 'Error stack trace'
      }

      errorHandlers.errorHandler(err, req, res, next)

      expect(logger.error).toHaveBeenCalledWith('Unknown error')
      expect(logger.error).toHaveBeenCalledWith('Error stack trace')
      expect(res.status).toHaveBeenCalledWith(status.HTTP_500_INTERNAL_SERVER_ERROR)
      expect(res.json).toHaveBeenCalledWith({
        status: status.HTTP_500_INTERNAL_SERVER_ERROR,
        error: 'Internal Server Error',
        message: 'Unknown error'
      })
    })

    it('should use default message if none provided', () => {
      const err = {
        statusCode: status.HTTP_500_INTERNAL_SERVER_ERROR,
        stack: 'Error stack trace'
      }

      errorHandlers.errorHandler(err, req, res, next)

      expect(logger.error).toHaveBeenCalledWith('Internal Server Error')
      expect(logger.error).toHaveBeenCalledWith('Error stack trace')
      expect(res.status).toHaveBeenCalledWith(status.HTTP_500_INTERNAL_SERVER_ERROR)
      expect(res.json).toHaveBeenCalledWith({
        status: status.HTTP_500_INTERNAL_SERVER_ERROR,
        error: 'Internal Server Error',
        message: 'Internal Server Error'
      })
    })
  })
})
