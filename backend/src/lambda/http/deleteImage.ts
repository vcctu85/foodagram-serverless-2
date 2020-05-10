import 'source-map-support/register'
import * as AWS  from 'aws-sdk'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
// import { decode } from 'jsonwebtoken'
// import { getToken } from '../auth/auth0Authorizer'
//import { deleteItem } from '../../businessLogic/images'
const imagesTable = process.env.IMAGES_TABLE
const docClient = new AWS.DynamoDB.DocumentClient()

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log(event)
   
    const imageId = event.pathParameters.imageId
    const groupId = event.pathParameters.groupId
    // TODO: Remove a TODO item by id
    console.log("Deleting todo item.")

    // const item = await deleteItem(groupId, imageId)
    await docClient.delete({
      TableName: imagesTable,
      Key: {
        groupId: groupId,
        imageId: imageId
      }
  }).promise()
    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: ""
    }
}

