import type { Event } from '@strapi/database/dist/lifecycles'
import { Marked, Renderer } from 'marked'

const renderer = new Renderer()
const marked = new Marked({ renderer })

const computedFieldsHook = async (event: Event) => {
  const partnerCampaign = event.params.data

  if (!partnerCampaign) {
    return
  }

  if (partnerCampaign.content) {
    partnerCampaign.htmlContent = await marked.parse(partnerCampaign.content)
  } else {
    partnerCampaign.htmlContent = ''
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
