// import { deleteImage, getImage } from '../dataLayer/groupsAccess'

// export async function deleteItem(groupId, imageId) {
//     const item = await getImage(groupId, imageId)
//     console.log(item)
//     await deleteImage(groupId, imageId)
//   }

import { createLogger } from '../utils/logger'
const logger = createLogger("createImage")
import * as AWSXRay from 'aws-xray-sdk'
import * as AWS  from 'aws-sdk'
const XAWS = AWSXRay.captureAWS(AWS)
// const groupsTable = process.env.GROUPS_TABLE
// const imagesTable = process.env.IMAGES_TABLE
const bucketName = process.env.IMAGES_S3_BUCKET
import { getItems, deleteItem, getItem, putItem } from '../dataLayer/groupsAccess'
const s3 = new XAWS.S3({
  signatureVersion: 'v4'
})

export async function createImage(groupId: string, imageId: string, event: any) {
  const timestamp = new Date().toISOString()
  const newImage = JSON.parse(event.body)
  logger.info("Creating new item")
  const newItem = {
    groupId,
    timestamp,
    imageId,
    ...newImage,
    imageUrl: `https://${bucketName}.s3.amazonaws.com/${imageId}`
  }
  console.log('Storing new item: ', newItem)

  await putItem(newItem)
  return newItem
}

export async function getUploadUrl(imageId: string) {
  return await s3.getSignedUrl('putObject', {
    Bucket: bucketName,
    Key: imageId,
    Expires: 300
  })
}

export async function getImagesPerGroup(groupId: string) {
  console.log("Getting all images in this group")
  const result = await getItems(groupId)
  return result
}

export async function deleteImage(groupId:string, imageId:string) {
  const item = await getItem(groupId, imageId)
  console.log(item)
  await deleteItem(groupId, imageId)
}

export async function getImage(groupId: string, imageId: string) {
  const item = await getItem(groupId, imageId)
  return item
}