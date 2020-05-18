import * as AWS from 'aws-sdk'
import { APIGatewayProxyResult } from 'aws-lambda'
const s3 = new AWS.S3()

export async function handler(): Promise<APIGatewayProxyResult> {
  try {
    const Bucket = process.env.BUCKET

    if (Bucket === undefined) {
      throw new Error('Bucket name is required')
    }

    const res = await s3.listObjectsV2({ Bucket, Prefix: 'source/' }).promise()

    return {
      statusCode: res.$response.httpResponse.statusCode,
      body: JSON.stringify(
        (res.Contents || []).filter(
          (item) => item.Key && /^.+\.jpe?g$/i.test(item.Key)
        )
      ),
    }
  } catch (err) {
    return {
      statusCode: err.statusCode || 400,
      body: err.message,
    }
  }
}
