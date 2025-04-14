import type { Event } from '@strapi/database/dist/lifecycles'
import { errors } from '@strapi/utils'

const resourceType = 'api::partner.partner'

const MAX_NUMBER_PARTNERS_DISPLAYED = 6

const validateBanner = async (event: Event) => {
  const {
    data: { displayOnLandingPage, documentId, publishedAt },
    where,
  } = event.params

  if (!displayOnLandingPage) {
    return
  }

  const partnersDisplayedOnLandingPage = await strapi.db
    .query(resourceType)
    .findMany({
      where: {
        displayOnLandingPage: { $eq: true },
        ...(where?.id ? { id: { $ne: where.id } } : {}),
        ...(documentId ? { documentId: { $ne: documentId } } : {}),
        ...(publishedAt
          ? { publishedAt: { $ne: null } }
          : { publishedAt: null }),
      },
    })

  if (partnersDisplayedOnLandingPage.length >= MAX_NUMBER_PARTNERS_DISPLAYED) {
    throw new errors.ValidationError(
      "Can't display more than 6 partners on the landing page"
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
