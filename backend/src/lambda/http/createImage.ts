import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as AWS  from 'aws-sdk'
import * as uuid from 'uuid'
// import * as AWSXRay from 'aws-xray-sdk'
import { createImage, getUploadUrl } from '../../businessLogic/images'
// const XAWS = AWSXRay.captureAWS(AWS)
import { createLogger } from '../../utils/logger'
const logger = createLogger("createImage")

const docClient = new AWS.DynamoDB.DocumentClient()


const groupsTable = process.env.GROUPS_TABLE
// const imagesTable = process.env.IMAGES_TABLE
// const bucketName = process.env.IMAGES_S3_BUCKET

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('Caller event', event)
  const groupId = event.pathParameters.groupId
  logger.info("Group ID", groupId)
  const validGroupId = await groupExists(groupId)

  if (!validGroupId) {
    logger.info("Group ID is not valid")
    return {
      statusCode: 404,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        error: 'Group does not exist'
      })
    }
  }

  const imageId = uuid.v4()
  logger.info("Image ID", imageId)
  const newItem = await createImage(groupId, imageId, event)
   
  const url = await getUploadUrl(imageId)
  logger.info("url", url)
  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      newItem: newItem,
      uploadUrl: url
    })
  }
}

async function groupExists(groupId: string) {
  const result = await docClient
    .get({
      TableName: groupsTable,
      Key: {
        id: groupId
      }
    })
    .promise()

  console.log('Get group: ', result)
  return !!result.Item
}
