import * as AWS  from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
const docClient = new AWS.DynamoDB.DocumentClient()
const imagesTable = process.env.IMAGES_TABLE
import { Group } from '../models/Group'
import { createLogger } from '../utils/logger'
const logger = createLogger("groupsAccess")
const imageIdIndex = process.env.IMAGE_ID_INDEX
export class GroupAccess {

  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly groupsTable = process.env.GROUPS_TABLE) {
  }

  async getAllGroups(): Promise<Group[]> {
    console.log('Getting all groups')
    logger.info("getting all groups")
    const result = await this.docClient.scan({
      TableName: this.groupsTable
    }).promise()

    const items = result.Items
    return items as Group[]
  }

  async createGroup(group: Group): Promise<Group> {
    logger.info("creating a group")
    await this.docClient.put({
      TableName: this.groupsTable,
      Item: group
    }).promise()

    return group
  }
}

export async function putItem(newItem) {
  await docClient
      .put({
      TableName: imagesTable,
      Item: newItem
      }).promise();

  return newItem;
}

export async function deleteItem(groupId: string, imageId: string) {
  const deletedItem = await docClient.delete({
      TableName: imagesTable,
      Key: {
        groupId: groupId,
        imageId: imageId
      }
    }).promise();
  return deletedItem;
}

export async function getItems(groupId: string) {
  const result = await docClient.query({
    TableName: imagesTable,
    KeyConditionExpression: 'groupId = :groupId',
    ExpressionAttributeValues: {
      ':groupId': groupId
    },
    ScanIndexForward: false
  }).promise()

  return result.Items
}

export async function getItem(groupId: string, imageId: string) {
  const result = await docClient.query({
    TableName : imagesTable,
    IndexName : imageIdIndex,
    KeyConditionExpression: 'groupId = :groupId and imageId = :imageId',
    ExpressionAttributeValues: {
        ':groupId': groupId,
        ':imageId': imageId
    }
  }).promise()
  return result;
}

function createDynamoDBClient() {
  if (process.env.IS_OFFLINE) {
    console.log('Creating a local DynamoDB instance')
    return new AWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:8000'
    })
  }

  return new AWS.DynamoDB.DocumentClient()
}
