import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as AWS from 'aws-sdk'
const s3 = new AWS.S3()

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
    const res = await s3
      .listObjectsV2({ Bucket, ContinuationToken, MaxKeys, Prefix: 'source/' })
      .promise()

    return {
      statusCode: res.$response.httpResponse.statusCode,
      body: JSON.stringify(res),
    }
  } catch (err) {
    return {
      statusCode: err.statusCode || 400,
      body: err.message,
    }
  }
}
