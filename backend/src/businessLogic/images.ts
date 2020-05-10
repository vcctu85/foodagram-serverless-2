import { deleteImage, getImage } from '../dataLayer/groupsAccess'

export async function deleteItem(groupId, imageId) {
    const item = await getImage(groupId, imageId)
    console.log(item)
    await deleteImage(groupId, imageId)
  }