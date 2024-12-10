import type { Event } from '@strapi/database/dist/lifecycles'
import { Marked } from 'marked'

const marked = new Marked()

const computedFieldsHook = (event: Event) => {
  const homePage = event.params.data
  if (!homePage) {
    return
  }

  if (homePage.title) {
    homePage.htmlTitle = marked.parse(homePage.title)
  } else {
    homePage.htmlTitle = ''
  }

  if (homePage.description) {
    homePage.htmlDescription = marked.parse(homePage.description)
  } else {
    homePage.htmlDescription = ''
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
