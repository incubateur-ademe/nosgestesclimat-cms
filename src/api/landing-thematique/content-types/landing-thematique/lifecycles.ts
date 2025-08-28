import type { Event } from '@strapi/database/dist/lifecycles'
import { Marked, Renderer } from 'marked'
import { removeEmptyTagsFromGeneratedHtml } from '../../../../helpers/removeEmptyTagsFromGeneratedHtml'

const renderer = new Renderer()
const marked = new Marked({ renderer })

interface BlockReference {
  id: number
  __pivot?: {
    field: string
    component_type: string
  }
}

const processBlockDescription = async (block?: BlockReference) => {
  if (block && block.id) {
    const fullBlock = await strapi.db.query('blocks.block-with-image').findOne({
      where: { id: block.id },
    })

    if (fullBlock && typeof fullBlock.description === 'string') {
      const htmlDescription = removeEmptyTagsFromGeneratedHtml(
        await marked.parse(fullBlock.description)
      )
      // Mettre à jour le champ htmlDescription du composant dans la base de données
      await strapi.db.query('blocks.block-with-image').update({
        where: { id: block.id },
        data: { htmlDescription },
      })
    }
  }
}

const processCarouselBlock = async (block?: BlockReference) => {
  if (block && block.id) {
    const fullBlock = await strapi.db.query('blocks.carousel').findOne({
      where: { id: block.id },
    })

    if (fullBlock && typeof fullBlock.text === 'string') {
      const htmlText = removeEmptyTagsFromGeneratedHtml(
        await marked.parse(fullBlock.text)
      )
      // Mettre à jour le champ htmlText du composant dans la base de données
      await strapi.db.query('blocks.carousel').update({
        where: { id: block.id },
        data: { htmlText },
      })
    }
  }
}

const computedFieldsHook = async (event: Event) => {
  const landingThematique = event.params.data

  if (!landingThematique) {
    return
  }

  // Traitement du champ legend pour générer htmlLegend
  if (typeof landingThematique.legend === 'string') {
    landingThematique.htmlLegend = removeEmptyTagsFromGeneratedHtml(
      await marked.parse(landingThematique.legend)
    )
  }

  // Traitement des blocs individuels
  const blockFields = [
    'block1',
    'block2',
    'block3',
    'block5',
    'block6',
    'block7',
  ]

  for (const fieldName of blockFields) {
    await processBlockDescription(landingThematique[fieldName])
  }

  // Traitement du bloc4 qui est repeatable (carousel)
  if (landingThematique.bloc4 && Array.isArray(landingThematique.bloc4)) {
    for (const block of landingThematique.bloc4) {
      await processCarouselBlock(block)
    }
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
