import type { Event } from '@strapi/database/dist/lifecycles'
import { Marked, Renderer } from 'marked'

const renderer = new Renderer()
const marked = new Marked({ renderer })

interface BlockReference {
  id: number
  __pivot?: {
    field: string
    component_type: string
  }
}

const processBlockDescription = async (block: BlockReference) => {
  if (block && block.id) {
    console.log(block.id, typeof block.id)
    try {
      const fullBlock = await strapi.db
        .query('blocks.block-with-image')
        .findOne({
          where: { id: block.id },
        })

      if (fullBlock && fullBlock.description) {
        const htmlDescription = await marked.parse(fullBlock.description)
        // Mettre à jour le champ htmlDescription du composant dans la base de données
        await strapi.db.query('blocks.block-with-image').update({
          where: { id: block.id },
          data: { htmlDescription },
        })
        console.log('Updated htmlDescription for block', block.id)
      }
    } catch (error) {
      console.error('Error fetching block content:', error)
    }
  }
}

const processCarouselBlock = async (block: BlockReference) => {
  if (block && block.id) {
    try {
      const fullBlock = await strapi.db.query('blocks.carousel').findOne({
        where: { id: block.id },
      })

      if (fullBlock && fullBlock.text) {
        const htmlText = await marked.parse(fullBlock.text)
        // Mettre à jour le champ htmlText du composant dans la base de données
        await strapi.db.query('blocks.carousel').update({
          where: { id: block.id },
          data: { htmlText },
        })
        console.log('Updated htmlText for carousel block', block.id)
      }
    } catch (error) {
      console.error('Error fetching carousel block content:', error)
    }
  }
}

const computedFieldsHook = async (event: Event) => {
  console.log('=== LIFECYCLE HOOK TRIGGERED ===')
  console.log('Event type:', event.action)

  const landingThematique = event.params.data

  if (!landingThematique) {
    console.log('No landingThematique data found')
    return
  }

  console.log('LandingThematique data keys:', Object.keys(landingThematique))

  // Traitement des blocs individuels
  const blockFields = ['bloc1', 'bloc2', 'bloc3', 'bloc5', 'bloc6', 'bloc7']

  for (const fieldName of blockFields) {
    console.log(`Processing field: ${fieldName}`)
    if (landingThematique[fieldName]) {
      console.log(`${fieldName} exists`)
      await processBlockDescription(landingThematique[fieldName])
    } else {
      console.log(`${fieldName} does not exist`)
    }
  }

  // Traitement du bloc4 qui est repeatable (carousel)
  if (landingThematique.bloc4 && Array.isArray(landingThematique.bloc4)) {
    console.log('Processing bloc4 carousel items')
    for (const block of landingThematique.bloc4) {
      await processCarouselBlock(block)
    }
  }

  console.log(
    'Final landingThematique data keys:',
    Object.keys(landingThematique)
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
