import type { Event } from '@strapi/database/dist/lifecycles'
import { Marked } from 'marked'

const marked = new Marked()

const computedFieldsHook = (event: Event) => {
  const author = event.params.data
  if (!author) {
    return
  }

  if (author.description) {
    author.htmlDescription = marked.parse(author.description)
  } else {
    author.htmlDescription = ''
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
