import type { Event } from '@strapi/database/dist/lifecycles'
import { Marked, Renderer } from 'marked'

const renderer = new Renderer()
const marked = new Marked({ renderer })

const computedFieldsHook = async (event: Event) => {
  const partnerCampaign = event.params.data

  if (!partnerCampaign) {
    return
  }

  if (typeof partnerCampaign.content === 'string') {
    partnerCampaign.htmlContent = await marked.parse(partnerCampaign.content)
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
