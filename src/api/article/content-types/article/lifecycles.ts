import type { Event } from '@strapi/database/dist/lifecycles'
import { Marked } from 'marked'

import { getHeadingList, gfmHeadingId } from 'marked-gfm-heading-id'
import slugify from 'slugify'

const marked = new Marked()
const headingIdsGenerator = gfmHeadingId()

marked.use(headingIdsGenerator)

const computedFieldsHook = async (event: Event) => {
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
    // Parse the content first
    article.htmlContent = marked.parse(article.content)

    // Find all image tags and enhance them with media information
    const imageRegex = /<img[^>]*src="([^">]+)"[^>]*>/g
    let match = []
    while ((match = imageRegex.exec(article.htmlContent)) !== null) {
      const imageUrl = match[1]
      const fullImageTag = match[0]

      // Query the upload plugin to find the media
      const image = await strapi.db.query('plugin::upload.file').findOne({
        where: { url: imageUrl },
      })

      const { url, alternativeText, caption } = image || {}

      if (caption) {
        const accessibleImage = `
          <figure>
            <img 
              src="${url}" 
              alt="${alternativeText || ''}"
            />
            ${caption ? `<figcaption class="italic text-sm text-center">${caption}</figcaption>` : ''}
          </figure>
        `

        article.htmlContent = article.htmlContent.replace(
          fullImageTag,
          accessibleImage
        )
      }
    }

    article.headings = getHeadingList().map(({ id, level, raw }) => {
      const cleanId = slugify(id, {
        strict: true,
      })

      if (cleanId !== id) {
        article.htmlContent = article.htmlContent.replace(
          `id="${id}"`,
          `id="${cleanId}"`
        )
        id = cleanId
      }

      return {
        id,
        level,
        text: raw,
      }
    })
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
