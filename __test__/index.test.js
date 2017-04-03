import request from 'supertest-as-promised'
import server from '../src'

describe('App API', () => {
  afterAll(() => {
    server.close()
  })

  test('should return \'Hello World!\'', () => {
    return request(server).get('/')
    .expect(200)
    .then((res) => {
      expect(typeof res.res.text).toBe('string')
      expect(res.res.text).toBe('Hello World!')
    })
  })
})
