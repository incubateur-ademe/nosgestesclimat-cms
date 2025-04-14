import type { Event } from '@strapi/database/dist/lifecycles'
import type { Token, Tokens } from 'marked'
import { Marked, Renderer } from 'marked'
import { getHeadingList, gfmHeadingId } from 'marked-gfm-heading-id'
import slugify from 'slugify'

type ImageWithCaptionToken = Tokens.Image & {
  caption?: string | null
}

const hasImageCaption = (
  token: Tokens.Image | ImageWithCaptionToken
): token is ImageWithCaptionToken => 'caption' in token

const headingIdsGenerator = gfmHeadingId()
const accessibleImageWalker = {
  async: true,
  async walkTokens(
    token: ImageWithCaptionToken | Exclude<Token, Tokens.Image>
  ) {
    if (token.type === 'image') {
      const image = await strapi.db.query('plugin::upload.file').findOne({
        where: { url: token.href },
      })

      const { alternativeText, caption } = image || {}

      token.text = alternativeText || token.text
      token.caption = caption
    }
  },
}

const renderer = new Renderer()
const originalImage = renderer.image.bind(renderer)

renderer.image = (token: Tokens.Image | ImageWithCaptionToken) =>
  hasImageCaption(token)
    ? `<figure>${originalImage(token)}<figcaption>${token.caption}</figcaption></figure>`
    : originalImage(token)

const marked = new Marked({ renderer })
marked.use(headingIdsGenerator, accessibleImageWalker)

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
    article.htmlContent = await marked.parse(article.content)
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
