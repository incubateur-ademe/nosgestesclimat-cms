import type { Event } from '@strapi/database/dist/lifecycles'
import { marked } from 'marked'
import { getHeadingList, gfmHeadingId } from 'marked-gfm-heading-id'

const headingIdsGenerator = gfmHeadingId()

marked.use(headingIdsGenerator)

const privateFieldsHook = (event: Event) => {
  const article = event.params.data
  if (!article) {
    return
  }

  if (!article.content) {
    article.html = ''
    article.headings = []
    return
  }

  const { content } = article

  article.html = marked.parse(content)
  article.headings = getHeadingList().map(({ id, level, raw }) => ({
    id,
    level,
    text: raw,
  }))
}

export default {
  beforeCreate(event: Event) {
    return privateFieldsHook(event)
  },
  beforeUpdate(event: Event) {
    return privateFieldsHook(event)
  },
}
