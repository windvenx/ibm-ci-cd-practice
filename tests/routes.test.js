/**
 * Counter API Service Test Suite
 *
 * Test cases can be run with the following:
 *   npm test
 *   npm run test:coverage
 */

const request = require('supertest')
const app = require('../service/app')
const status = require('../service/common/status')
const routes = require('../service/routes')

describe('Counter API Service', () => {
  beforeEach(() => {
    // Reset counters before each test
    routes.resetCounters()
  })

  afterAll(() => {
    // Clean up after all tests
    routes.resetCounters()
  })

  describe('GET /', () => {
    it('should call the index endpoint', async () => {
      const response = await request(app).get('/')

      expect(response.status).toBe(status.HTTP_200_OK)
      expect(response.body).toHaveProperty('message', 'Hit Counter Service')
      expect(response.body).toHaveProperty('version', '1.0.0')
      expect(response.body).toHaveProperty('url')
    })
  })

  describe('GET /health', () => {
    it('should be healthy', async () => {
      const response = await request(app).get('/health')

      expect(response.status).toBe(status.HTTP_200_OK)
      expect(response.body).toHaveProperty('status', 'OK')
    })
  })

  describe('POST /counters/:name', () => {
    it('should create a counter', async () => {
      const name = 'foo'
      const response = await request(app).post(`/counters/${name}`)

      expect(response.status).toBe(status.HTTP_201_CREATED)
      expect(response.body).toHaveProperty('name', name)
      expect(response.body).toHaveProperty('counter', 0)
      expect(response.headers).toHaveProperty('location')
    })

    it('should not create a duplicate counter', async () => {
      const name = 'foo'

      // Create first counter
      let response = await request(app).post(`/counters/${name}`)
      expect(response.status).toBe(status.HTTP_201_CREATED)
      expect(response.body).toHaveProperty('name', name)
      expect(response.body).toHaveProperty('counter', 0)

      // Try to create duplicate
      response = await request(app).post(`/counters/${name}`)
      expect(response.status).toBe(status.HTTP_409_CONFLICT)
      expect(response.body).toHaveProperty('error', 'Conflict')
    })
  })

  describe('GET /counters', () => {
    it('should list counters', async () => {
      let response = await request(app).get('/counters')

      expect(response.status).toBe(status.HTTP_200_OK)
      expect(response.body).toHaveLength(0)

      // Create a counter and make sure it appears in the list
      await request(app).post('/counters/foo')
      response = await request(app).get('/counters')

      expect(response.status).toBe(status.HTTP_200_OK)
      expect(response.body).toHaveLength(1)
      expect(response.body[0]).toHaveProperty('name', 'foo')
      expect(response.body[0]).toHaveProperty('counter', 0)
    })
  })

  describe('GET /counters/:name', () => {
    it('should read a counter', async () => {
      const name = 'foo'

      // Create counter first
      await request(app).post(`/counters/${name}`)

      const response = await request(app).get(`/counters/${name}`)

      expect(response.status).toBe(status.HTTP_200_OK)
      expect(response.body).toHaveProperty('name', name)
      expect(response.body).toHaveProperty('counter', 0)
    })

    it('should return 404 for non-existent counter', async () => {
      const response = await request(app).get('/counters/nonexistent')

      expect(response.status).toBe(status.HTTP_404_NOT_FOUND)
      expect(response.body).toHaveProperty('error', 'Not Found')
    })
  })

  describe('PUT /counters/:name', () => {
    it('should update a counter', async () => {
      const name = 'foo'

      // Create counter first
      let response = await request(app).post(`/counters/${name}`)
      expect(response.status).toBe(status.HTTP_201_CREATED)

      // Read initial value
      response = await request(app).get(`/counters/${name}`)
      expect(response.status).toBe(status.HTTP_200_OK)
      expect(response.body).toHaveProperty('name', name)
      expect(response.body).toHaveProperty('counter', 0)

      // Update counter
      response = await request(app).put(`/counters/${name}`)
      expect(response.status).toBe(status.HTTP_200_OK)
      expect(response.body).toHaveProperty('name', name)
      expect(response.body).toHaveProperty('counter', 1)
    })

    it('should not update a missing counter', async () => {
      const name = 'foo'
      const response = await request(app).put(`/counters/${name}`)

      expect(response.status).toBe(status.HTTP_404_NOT_FOUND)
      expect(response.body).toHaveProperty('error', 'Not Found')
    })
  })

  describe('DELETE /counters/:name', () => {
    it('should delete a counter', async () => {
      const name = 'foo'

      // Create counter first
      let response = await request(app).post(`/counters/${name}`)
      expect(response.status).toBe(status.HTTP_201_CREATED)

      // Delete counter (twice should return same result)
      response = await request(app).delete(`/counters/${name}`)
      expect(response.status).toBe(status.HTTP_204_NO_CONTENT)

      response = await request(app).delete(`/counters/${name}`)
      expect(response.status).toBe(status.HTTP_204_NO_CONTENT)

      // Verify it's really gone
      response = await request(app).get(`/counters/${name}`)
      expect(response.status).toBe(status.HTTP_404_NOT_FOUND)
    })
  })
})
