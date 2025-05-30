import type { Event } from '@strapi/database/dist/lifecycles'
import { Marked } from 'marked'
import slugify from 'slugify'

const marked = new Marked()

const computedFieldsHook = (event: Event) => {
  const category = event.params.data
  if (!category) {
    return
  }

  if (typeof category.description === 'string') {
    category.htmlDescription = marked.parse(category.description)
  }

  if (typeof category.faqDescription === 'string') {
    category.htmlFaqDescription = marked.parse(category.faqDescription)
  }

  if (typeof category.content === 'string') {
    category.htmlContent = marked.parse(category.content)
  }

  if (typeof category.slug === 'string') {
    category.slug = slugify(category.slug, {
      lower: true,
    })
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
