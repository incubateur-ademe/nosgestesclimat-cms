import type { Event } from '@strapi/database/dist/lifecycles'
import { Marked } from 'marked'

const marked = new Marked()

const computedFieldsHook = (event: Event) => {
  const homePage = event.params.data
  if (!homePage) {
    return
  }

  if (typeof homePage.title === 'string') {
    homePage.htmlTitle = marked.parse(homePage.title)
  }

  if (typeof homePage.description === 'string') {
    homePage.htmlDescription = marked.parse(homePage.description)
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
