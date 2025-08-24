import type { Event } from '@strapi/database/dist/lifecycles'
import { Marked, Renderer } from 'marked'

const renderer = new Renderer()
const marked = new Marked({ renderer })

const computedFieldsHook = async (event: Event) => {
  const landingCampaign = event.params.data

  if (!landingCampaign) {
    return
  }

  if (typeof landingCampaign.content === 'string') {
    landingCampaign.htmlContent = await marked.parse(landingCampaign.content)
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
