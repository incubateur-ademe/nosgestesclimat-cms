import type { Event } from '@strapi/database/dist/lifecycles'

const computedFieldsHook = (event: Event) => {
  const faq = event.params.data
  if (!faq) {
    return
  }

  if (
    typeof faq.kind === 'string' &&
    typeof faq.title === 'string' &&
    typeof faq.order === 'number'
  ) {
    faq.key = `Kind: ${faq.kind} - Order: ${faq.order} - ${faq.title}`
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
