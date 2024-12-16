import type { Event } from '@strapi/database/dist/lifecycles'
import { Marked } from 'marked'

import { getHeadingList, gfmHeadingId } from 'marked-gfm-heading-id'
import slugify from 'slugify'

const marked = new Marked()
const headingIdsGenerator = gfmHeadingId()

marked.use(headingIdsGenerator)

const computedFieldsHook = (event: Event) => {
  const article = event.params.data
  if (!article) {
    return
  }

  if (!article.slug && article.title) {
    article.slug = slugify(article.title, {
      lower: true,
    })
  }

  if (article.content) {
    article.htmlContent = marked.parse(article.content)
    article.headings = getHeadingList().map(({ id, level, raw }) => ({
      id,
      level,
      text: raw,
    }))
  } else {
    article.htmlContent = ''
    article.headings = []
  }

  if (article.description) {
    article.htmlDescription = marked.parse(article.description)
  } else {
    article.htmlDescription = ''
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
