import type { Event } from '@strapi/database/dist/lifecycles'

const validateDates = (event: Event) => {
  const banner = event.params.data
  // End date must be after start date
  if (banner.startDate && banner.endDate) {
    const startDate = new Date(banner.startDate)
    const endDate = new Date(banner.endDate)

    if (endDate < startDate) {
      throw new Error('End date cannot be before the start date')
    }
  }
}

module.exports = {
  beforeCreate(event: Event) {
    validateDates(event)
  },
  beforeUpdate(event: Event) {
    validateDates(event)
  },
}
