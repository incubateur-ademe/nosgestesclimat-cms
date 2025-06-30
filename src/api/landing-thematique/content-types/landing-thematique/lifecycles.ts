import type { Event } from '@strapi/database/dist/lifecycles'
import { Marked, Renderer } from 'marked'

const renderer = new Renderer()
const marked = new Marked({ renderer })

const computedFieldsHook = async (event: Event) => {
  const landingThematique = event.params.data

  if (!landingThematique) {
    return
  }

  const textToHtmlMapping = {
    heroText: 'htmlHeroText',
    secondBlockText: 'htmlSecondBlockText',
    thirdBlockText: 'htmlThirdBlockText',
    actionsBlockText: 'htmlActionsBlockText',
    articlesBlockText: 'htmlArticlesBlockText',
    seventhBlockText: 'htmlSeventhBlockText',
  }

  for (const [textField, htmlField] of Object.entries(textToHtmlMapping)) {
    if (typeof landingThematique[textField] === 'string') {
      landingThematique[htmlField] = await marked.parse(
        landingThematique[textField]
      )
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
