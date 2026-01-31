/**
 * Logger Module
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

// Define log levels
const LOG_LEVELS = {
  DEBUG: 10,
  INFO: 20,
  WARN: 30,
  ERROR: 40,
  CRITICAL: 50
}

// Get log level from environment or default to INFO
const getLogLevel = () => {
  const level = (process.env.LOG_LEVEL || 'info').toUpperCase()
  return LOG_LEVELS[level] || LOG_LEVELS.INFO
}

// Simple logger implementation
const logger = {
  debug: (message) => {
    if (getLogLevel() <= LOG_LEVELS.DEBUG) {
      console.debug(`DEBUG: ${message}`)
    }
  },

  info: (message) => {
    if (getLogLevel() <= LOG_LEVELS.INFO) {
      console.info(`INFO: ${message}`)
    }
  },

  warn: (message) => {
    if (getLogLevel() <= LOG_LEVELS.WARN) {
      console.warn(`WARNING: ${message}`)
    }
  },

  error: (message) => {
    if (getLogLevel() <= LOG_LEVELS.ERROR) {
      console.error(`ERROR: ${message}`)
    }
  },

  critical: (message) => {
    if (getLogLevel() <= LOG_LEVELS.CRITICAL) {
      console.error(`CRITICAL: ${message}`)
    }
  }
}

module.exports = logger
