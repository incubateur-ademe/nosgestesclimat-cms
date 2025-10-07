import type { Event } from '@strapi/database/dist/lifecycles'
import { errors } from '@strapi/utils'
import { Marked } from 'marked'

const marked = new Marked()

const computedFieldsHook = async (event: Event) => {
  const { data: imageDescription, where } = event.params
  if (!imageDescription) {
    return
  }

  const {
    locale,
    documentId,
    publishedAt,
    image: { id: imageId } = { id: null },
  } = imageDescription

  if (imageId) {
    const existingDescription = await strapi.db
      .query('api::image-description.image-description')
      .findOne({
        where: {
          image: imageId,
          locale,
          ...(where?.id ? { id: { $ne: where.id } } : {}),
          ...(documentId ? { documentId: { $ne: documentId } } : {}),
          ...(publishedAt
            ? { publishedAt: { $ne: null } }
            : { publishedAt: null }),
        },
      })

    if (existingDescription) {
      throw new errors.ValidationError(
        'Description already exists for this image'
      )
    }
  }

  if (typeof imageDescription.description === 'string') {
    imageDescription.htmlDescription = marked.parse(
      imageDescription.description
    )
  }
}

export default {
  beforeCreate(event: Event) {
    return computedFieldsHook(event)
  },
  beforeUpdate(event: Event) {
    return computedFieldsHook(event)
  },
}
