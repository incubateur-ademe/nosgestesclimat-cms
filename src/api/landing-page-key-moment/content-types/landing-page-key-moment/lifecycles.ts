import type { Event } from '@strapi/database/dist/lifecycles'
import { errors } from '@strapi/utils'
import { Marked, Renderer } from 'marked'

const renderer = new Renderer()
const marked = new Marked({ renderer })

const resourceType = 'api::landing-page-key-moment.landing-page-key-moment'

interface ComponentRef {
  id?: number
  __pivot?: {
    field: string
    component_type: string
  }
}

const processHeroSection = async (heroSection?: ComponentRef) => {
  if (!heroSection) {
    return
  }

  if (heroSection.id) {
    const full = await strapi.db
      .query('landing-page-key-moment.hero-section')
      .findOne({ where: { id: heroSection.id } })

    if (full && typeof full.titleDescription === 'string') {
      const htmlTitleDescription = await marked.parse(full.titleDescription)
      await strapi.db.query('landing-page-key-moment.hero-section').update({
        where: { id: heroSection.id },
        data: { htmlTitleDescription },
      })
    }
  }
}

const processTestimonial = async (testimonial?: ComponentRef) => {
  if (!testimonial) {
    return
  }

  if (testimonial.id) {
    const full = await strapi.db
      .query('landing-page-key-moment.testimonial')
      .findOne({ where: { id: testimonial.id } })

    if (full && typeof full.text === 'string') {
      const htmlText = marked.parse(full.text)
      await strapi.db
        .query('landing-page-key-moment.testimonial')
        .update({ where: { id: testimonial.id }, data: { htmlText } })
    }
  }
}

const processContribItem = async (item?: ComponentRef) => {
  if (!item) {
    return
  }

  if (item.id) {
    const full = await strapi.db
      .query('landing-page-key-moment.contrib-item')
      .findOne({ where: { id: item.id } })

    if (full && typeof full.text === 'string') {
      const htmlText = marked.parse(full.text)
      await strapi.db
        .query('landing-page-key-moment.contrib-item')
        .update({ where: { id: item.id }, data: { htmlText } })
    }
  }
}

const processHowToContribute = async (howToContribute?: ComponentRef) => {
  if (!howToContribute) {
    return
  }

  if (howToContribute.id) {
    const full = await strapi.db
      .query('landing-page-key-moment.how-to-contribute')
      .findOne({ where: { id: howToContribute.id } })

    if (full) {
      const itemsLabel1: ComponentRef[] = full.itemsLabel1 ?? []
      for (const item of itemsLabel1) {
        await processContribItem(item)
      }

      const itemsLabel2: ComponentRef[] = full.itemsLabel2 ?? []
      for (const item of itemsLabel2) {
        await processContribItem(item)
      }
    }
  }
}

const processFooterBlock = async (block?: ComponentRef) => {
  if (!block) {
    return
  }

  if (block.id) {
    const full = await strapi.db
      .query('landing-page-key-moment.footer-block')
      .findOne({ where: { id: block.id } })

    if (full && typeof full.text === 'string') {
      const htmlText = marked.parse(full.text)
      await strapi.db
        .query('landing-page-key-moment.footer-block')
        .update({ where: { id: block.id }, data: { htmlText } })
    }
  }
}

const processFooterSection = async (footerSection?: ComponentRef) => {
  if (!footerSection) {
    return
  }

  if (footerSection.id) {
    const full = await strapi.db
      .query('landing-page-key-moment.footer-section')
      .findOne({ where: { id: footerSection.id } })

    if (full) {
      if (full.block1) {
        await processFooterBlock(full.block1 as ComponentRef)
      }
      if (full.block2) {
        await processFooterBlock(full.block2 as ComponentRef)
      }
    }
  }
}

const computedFieldsHook = async (event: Event) => {
  const data = event.params.data as Record<string, unknown> | undefined

  if (!data) {
    return
  }

  // Hero section
  await processHeroSection(data.heroSection as ComponentRef | undefined)

  // Testimonials (repeatable)
  if (Array.isArray(data.testimonials)) {
    for (const testimonial of data.testimonials) {
      await processTestimonial(testimonial as ComponentRef)
    }
  }

  // How to contribute
  await processHowToContribute(data.howToContribute as ComponentRef | undefined)

  // Footer section
  await processFooterSection(data.footerSection as ComponentRef | undefined)
}

const validateDates = async (event: Event) => {
  const {
    data: { startDate, endDate, locale, documentId, publishedAt },
    where,
  } = event.params

  if (endDate && startDate && endDate < startDate) {
    throw new errors.ValidationError(
      'La date de fin ne peut pas être antérieure à la date de début'
    )
  }

  const existing = await strapi.db.query(resourceType).findOne({
    where: {
      startDate: { $lt: endDate },
      endDate: { $gt: startDate },
      locale,
      ...(where?.id ? { id: { $ne: where.id } } : {}),
      ...(documentId ? { documentId: { $ne: documentId } } : {}),
      ...(publishedAt ? { publishedAt: { $ne: null } } : { publishedAt: null }),
    },
  })

  if (existing) {
    throw new errors.ValidationError(
      "Les dates de cette landing page chevauchent celles d'une landing page existante"
    )
  }
}

export default {
  beforeCreate(event: Event) {
    return Promise.all([computedFieldsHook(event), validateDates(event)])
  },
  beforeUpdate(event: Event) {
    return Promise.all([computedFieldsHook(event), validateDates(event)])
  },
}
