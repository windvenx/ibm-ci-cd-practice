/**
 * Logger Test Suite
 */

const logger = require('../service/common/logger')

describe('Logger', () => {
  let originalEnv
  let consoleSpies = {}

  beforeEach(() => {
    // Save original environment
    originalEnv = process.env.LOG_LEVEL

    // Spy on console methods
    consoleSpies = {
      debug: jest.spyOn(console, 'debug').mockImplementation(),
      info: jest.spyOn(console, 'info').mockImplementation(),
      warn: jest.spyOn(console, 'warn').mockImplementation(),
      error: jest.spyOn(console, 'error').mockImplementation()
    }
  })

  afterEach(() => {
    // Restore original environment
    process.env.LOG_LEVEL = originalEnv

    // Restore console methods
    Object.values(consoleSpies).forEach(spy => spy.mockRestore())
  })

  describe('Log levels', () => {
    it('should log debug messages when LOG_LEVEL is debug', () => {
      process.env.LOG_LEVEL = 'debug'

      logger.debug('Debug message')
      logger.info('Info message')
      logger.warn('Warning message')
      logger.error('Error message')
      logger.critical('Critical message')

      expect(consoleSpies.debug).toHaveBeenCalledWith('DEBUG: Debug message')
      expect(consoleSpies.info).toHaveBeenCalledWith('INFO: Info message')
      expect(consoleSpies.warn).toHaveBeenCalledWith('WARNING: Warning message')
      expect(consoleSpies.error).toHaveBeenCalledWith('ERROR: Error message')
      expect(consoleSpies.error).toHaveBeenCalledWith('CRITICAL: Critical message')
    })

    it('should not log debug messages when LOG_LEVEL is info', () => {
      process.env.LOG_LEVEL = 'info'

      logger.debug('Debug message')
      logger.info('Info message')
      logger.warn('Warning message')
      logger.error('Error message')
      logger.critical('Critical message')

      expect(consoleSpies.debug).not.toHaveBeenCalled()
      expect(consoleSpies.info).toHaveBeenCalledWith('INFO: Info message')
      expect(consoleSpies.warn).toHaveBeenCalledWith('WARNING: Warning message')
      expect(consoleSpies.error).toHaveBeenCalledWith('ERROR: Error message')
      expect(consoleSpies.error).toHaveBeenCalledWith('CRITICAL: Critical message')
    })

    it('should only log warn, error and critical when LOG_LEVEL is warn', () => {
      process.env.LOG_LEVEL = 'warn'

      logger.debug('Debug message')
      logger.info('Info message')
      logger.warn('Warning message')
      logger.error('Error message')
      logger.critical('Critical message')

      expect(consoleSpies.debug).not.toHaveBeenCalled()
      expect(consoleSpies.info).not.toHaveBeenCalled()
      expect(consoleSpies.warn).toHaveBeenCalledWith('WARNING: Warning message')
      expect(consoleSpies.error).toHaveBeenCalledWith('ERROR: Error message')
      expect(consoleSpies.error).toHaveBeenCalledWith('CRITICAL: Critical message')
    })

    it('should only log error and critical when LOG_LEVEL is error', () => {
      process.env.LOG_LEVEL = 'error'

      logger.debug('Debug message')
      logger.info('Info message')
      logger.warn('Warning message')
      logger.error('Error message')
      logger.critical('Critical message')

      expect(consoleSpies.debug).not.toHaveBeenCalled()
      expect(consoleSpies.info).not.toHaveBeenCalled()
      expect(consoleSpies.warn).not.toHaveBeenCalled()
      expect(consoleSpies.error).toHaveBeenCalledWith('ERROR: Error message')
      expect(consoleSpies.error).toHaveBeenCalledWith('CRITICAL: Critical message')
    })

    it('should only log critical when LOG_LEVEL is critical', () => {
      process.env.LOG_LEVEL = 'critical'

      logger.debug('Debug message')
      logger.info('Info message')
      logger.warn('Warning message')
      logger.error('Error message')
      logger.critical('Critical message')

      expect(consoleSpies.debug).not.toHaveBeenCalled()
      expect(consoleSpies.info).not.toHaveBeenCalled()
      expect(consoleSpies.warn).not.toHaveBeenCalled()
      expect(consoleSpies.error).not.toHaveBeenCalledWith('ERROR: Error message')
      expect(consoleSpies.error).toHaveBeenCalledWith('CRITICAL: Critical message')
    })

    it('should default to info level if LOG_LEVEL is not set', () => {
      delete process.env.LOG_LEVEL

      logger.debug('Debug message')
      logger.info('Info message')

      expect(consoleSpies.debug).not.toHaveBeenCalled()
      expect(consoleSpies.info).toHaveBeenCalledWith('INFO: Info message')
    })

    it('should default to info level if LOG_LEVEL is invalid', () => {
      process.env.LOG_LEVEL = 'invalid_level'

      logger.debug('Debug message')
      logger.info('Info message')

      expect(consoleSpies.debug).not.toHaveBeenCalled()
      expect(consoleSpies.info).toHaveBeenCalledWith('INFO: Info message')
    })
  })
})
