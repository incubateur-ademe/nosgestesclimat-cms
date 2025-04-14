import type { Event } from '@strapi/database/dist/lifecycles'
import { errors } from '@strapi/utils'

const resourceType = 'api::banner.banner'

const validateBanner = async (event: Event) => {
  const {
    data: { endDate, startDate, locale, documentId, publishedAt },
    where,
  } = event.params

  if (endDate < startDate) {
    throw new errors.ValidationError('End date cannot be before the start date')
  }

  const existing = await strapi.db.query(resourceType).findOne({
    where: {
      startDate: { $lt: endDate },
      endDate: { $gt: startDate },
      locale,
      ...(where?.id ? { id: { $ne: where.id } } : {}),
      ...(documentId ? { documentId: { $ne: documentId } } : {}),
      ...(publishedAt ? { publishedAt: { $ne: null } } : { publishedAt: null }),
    },
  })

  if (existing) {
    throw new errors.ValidationError(
      'Banner dates overlap with an existing banner'
    )
  }
}

export default {
  beforeCreate(event: Event) {
    return validateBanner(event)
  },
  beforeUpdate(event: Event) {
    return validateBanner(event)
  },
}
