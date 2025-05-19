import type { Event } from '@strapi/database/dist/lifecycles'
import { Marked, Renderer } from 'marked'
import slugify from 'slugify'

const renderer = new Renderer()
const marked = new Marked({ renderer })

const computedFieldsHook = async (event: Event) => {
  const partnerCampaign = event.params.data

  if (!partnerCampaign) {
    return
  }

  if (typeof partnerCampaign.slug === 'undefined') {
    partnerCampaign.slug = slugify(String(partnerCampaign.slug), {
      lower: true,
    })
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
