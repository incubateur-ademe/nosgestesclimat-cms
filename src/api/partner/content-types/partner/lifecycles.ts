import type { Event } from '@strapi/database/dist/lifecycles'
import { errors } from '@strapi/utils'

const resourceType = 'api::partner.partner'

const validateBanner = async (event: Event) => {
  const {
    data: { displayOnLandingPage, documentId },
  } = event.params

  const partnersDisplayedOnLandingPage = await strapi.db
    .query(resourceType)
    .findMany({
      where: {
        displayOnLandingPage: { $eq: true },
        documentId: { $ne: documentId },
      },
    })

  // Filter out duplicates by ID
  const uniquePartners = Array.from(
    new Set(partnersDisplayedOnLandingPage.map((p) => p.documentId))
  ).map((documentId) =>
    partnersDisplayedOnLandingPage.find((p) => p.documentId === documentId)
  )

  if (uniquePartners.length > 5 && displayOnLandingPage) {
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
