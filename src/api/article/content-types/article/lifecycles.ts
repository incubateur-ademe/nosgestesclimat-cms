import type { Event } from '@strapi/database/dist/lifecycles'
import type { Token, Tokens } from 'marked'
import { Marked, Parser, Renderer } from 'marked'
import { getHeadingList, gfmHeadingId } from 'marked-gfm-heading-id'
import { AsyncLocalStorage } from 'node:async_hooks'
import slugify from 'slugify'

type DetailedImageToken = Tokens.Image & {
  caption?: string | null
  detailedDescription?: {
    id: number
    htmlDescription: string
    summary: string
  } | null
}

type ParagraphWithDetailedImageToken = Omit<Tokens.Paragraph, 'tokens'> & {
  tokens: [DetailedImageToken]
}

const asyncLocalStorage = new AsyncLocalStorage<{
  locale: string
  published: boolean
}>()

const isParagraphWithImageToken = (
  token: Tokens.Paragraph
): token is ParagraphWithDetailedImageToken => {
  const { tokens = [] } = token

  if (tokens.length !== 1) {
    return false
  }

  const [imageToken] = tokens

  return imageToken.type === 'image'
}

const headingIdsGenerator = gfmHeadingId()
const accessibleImageWalker = {
  async: true,
  async walkTokens(token: DetailedImageToken | Exclude<Token, Tokens.Image>) {
    if (token.type === 'image') {
      const { locale = 'fr', published = false } =
        asyncLocalStorage.getStore() || {}

      const image = await strapi.db.query('plugin::upload.file').findOne({
        where: { url: token.href },
      })

      const { alternativeText, caption, id: imageId } = image || {}

      token.text = alternativeText || ''
      token.caption = caption

      if (!token.text && Array.isArray(token.tokens)) {
        token.tokens
          .filter((t): t is Tokens.Text => t.type === 'text')
          .forEach((t) => (t.text = ''))
      }

      if (imageId) {
        const imageDescription = await strapi.db
          .query('api::image-description.image-description')
          .findOne({
            where: {
              image: imageId,
              locale,
              publishedAt: published ? { $not: null } : { $eq: null },
            },
          })

        token.detailedDescription = imageDescription
      }
    }
  },
}

const renderer = new Renderer()
renderer.parser = new Parser()
const originalParagraph = renderer.paragraph.bind(renderer)

renderer.paragraph = (token: Tokens.Paragraph) => {
  if (isParagraphWithImageToken(token)) {
    const {
      tokens: [imageToken],
    } = token

    const { caption, detailedDescription } = imageToken

    const dom: string[] = []

    dom.push('<figure>')

    const img = renderer.image(imageToken)

    if (detailedDescription) {
      dom.push(
        img.replace(
          /^<img\s/,
          `<img aria-describedby="image-description-${detailedDescription.id}"`
        )
      )
    } else {
      dom.push(img)
    }

    if (caption) {
      dom.push(`<figcaption>${caption}</figcaption>`)
    }

    dom.push('</figure>')

    if (detailedDescription) {
      dom.push(
        `<details id="image-description-${detailedDescription.id}"><summary>${detailedDescription.summary}</summary><div>${detailedDescription.htmlDescription}</div></details>`
      )
    }

    return dom.join('')
  }

  return originalParagraph(token)
}

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

  await asyncLocalStorage.run(
    { locale: article.locale || 'fr', published: !!article.publishedAt },
    async () => {
      if (typeof article.content === 'string') {
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
      }

      if (typeof article.description === 'string') {
        article.htmlDescription = await marked.parse(article.description)
      }
    }
  )
}

export default {
  beforeCreate(event: Event) {
    return computedFieldsHook(event)
  },
  beforeUpdate(event: Event) {
    return computedFieldsHook(event)
  },
}
