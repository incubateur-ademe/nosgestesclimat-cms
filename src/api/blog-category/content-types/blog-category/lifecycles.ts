import type { Event } from '@strapi/database/dist/lifecycles'
import { Marked } from 'marked'
import slugify from 'slugify'

const marked = new Marked()

const computedFieldsHook = (event: Event) => {
  const blogCategory = event.params.data
  if (!blogCategory) {
    return
  }

  if (typeof blogCategory.description === 'string') {
    blogCategory.htmlDescription = marked.parse(blogCategory.description)
  }

  if (typeof blogCategory.faqDescription === 'string') {
    blogCategory.htmlFaqDescription = marked.parse(blogCategory.faqDescription)
  }

  if (typeof blogCategory.content === 'string') {
    blogCategory.htmlContent = marked.parse(blogCategory.content)
  }

  if (typeof blogCategory.slug === 'string') {
    blogCategory.slug = slugify(blogCategory.slug, {
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
