import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'

import { CreateGroupRequest } from '../../requests/CreateGroupRequest'
import { createGroup } from '../../businessLogic/groups'
import { createLogger } from '../../utils/logger'
const logger = createLogger("createGroup")

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('Processing event: ', event)

  const newGroup: CreateGroupRequest = JSON.parse(event['body'])
  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]
  logger.info('Creating group')
  logger.info('processing event: ', event)
  const newItem = await createGroup(newGroup, jwtToken)

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      newItem
    })
  }
}
