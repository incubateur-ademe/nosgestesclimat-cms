import type { Event } from '@strapi/database/dist/lifecycles'
import { Marked } from 'marked'
import slugify from 'slugify'

const marked = new Marked()

const computedFieldsHook = (event: Event) => {
  const category = event.params.data
  if (!category) {
    return
  }

  if (category.description) {
    category.htmlDescription = marked.parse(category.description)
  } else {
    category.htmlDescription = ''
  }

  if (category.faqDescription) {
    category.htmlFaqDescription = marked.parse(category.faqDescription)
  } else {
    category.htmlFaqDescription = ''
  }

  if (category.title) {
    category.slug = slugify(category.title, {
      lower: true,
    })
  } else {
    category.slug = ''
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
