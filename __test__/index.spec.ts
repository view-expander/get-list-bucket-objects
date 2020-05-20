import * as AWS from 'aws-sdk'
import { handler } from '../src'

describe('handler()', () => {
  beforeEach(() => {
    // set environments
    process.env.BUCKET = undefined

    // mock aws-sdk
    jest
      .spyOn((AWS.S3 as any).services['2006-03-01'].prototype, 'listObjectsV2')
      .mockImplementation(() => ({
        promise: (): any => ({
          $response: {
            httpResponse: {
              statusCode: 200,
            },
          },
          Contents: [
            {
              Key: 'hoge.jpg',
              LastModified: '2020-05-09T06:33:51.000Z',
              ETag: '44c452ca6297705b5c7bea4246ecaf09',
              Size: 2636121,
              StorageClass: 'StorageClass',
            },
            {
              Key: 'piyo.svg',
              LastModified: '2020-05-09T06:33:51.000Z',
              ETag: '37305f4d32679861ad71971c843ddbeb',
              Size: 1927537,
              StorageClass: 'StorageClass',
            },
            {
              Key: 'fuga.jpg',
              LastModified: '2020-05-09T06:33:50.000Z',
              ETag: '2e7d2444cbb4e79680a64288eeaa7d5e',
              Size: 2074755,
              StorageClass: 'StorageClass',
            },
          ],
          Name: 'TARGET_BUCKET_NAME',
          Prefix: 'source/',
          MaxKeys: 100,
          CommonPrefixes: [],
          KeyCount: 100,
          NextContinuationToken: 'DUMMY_TOKEN',
        }),
      }))
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('be succeed', async () => {
    expect.assertions(1)

    // set environments
    process.env.BUCKET = 'TARGET_BUCKET_NAME'

    return expect(
      handler({
        queryStringParameters: null,
      } as any)
    ).resolves.toMatchSnapshot()
  })
})
