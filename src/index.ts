import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as AWS from 'aws-sdk'
const s3 = new AWS.S3()

const SHARED_RESPONSE_HEADER = {
  'Access-Control-Allow-Origin': '*',
  'Content-Type': 'application/json',
} as const

export async function handler(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  try {
    const Bucket = process.env.BUCKET

    if (Bucket === undefined) {
      throw new Error('Bucket name is required')
    }

    const ContinuationToken = event.queryStringParameters?.ContinuationToken
    const MaxKeys = Number(event.queryStringParameters?.MaxKeys || 100)
    const Prefix = 'source/'
    const res = await s3
      .listObjectsV2({
        Bucket,
        ContinuationToken,
        MaxKeys,
        Prefix,
        StartAfter: Prefix,
      })
      .promise()

    return {
      statusCode: res.$response.httpResponse.statusCode,
      headers: {
        ...SHARED_RESPONSE_HEADER,
      },
      body: JSON.stringify({
        ...res,
        Contents: (res.Contents || []).map((item) => ({
          ...item,
          Key:
            typeof item.Key === 'string'
              ? item.Key.replace(Prefix, '')
              : undefined,
        })),
      }),
    }
  } catch (err) {
    return {
      statusCode: err.statusCode || 500,
      headers: {
        ...SHARED_RESPONSE_HEADER,
      },
      body: err.message,
    }
  }
}
