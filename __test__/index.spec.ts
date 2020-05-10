import { handler } from '../src'

describe('handler()', () => {
  it('return undefined', async () => {
    expect.assertions(1)
    return expect(handler()).resolves.toBeUndefined()
  })
})
