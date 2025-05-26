import type { Event } from '@strapi/database/dist/lifecycles'
import { Marked } from 'marked'

const marked = new Marked()

const computedFieldsHook = (event: Event) => {
  const question = event.params.data
  if (!question) {
    return
  }

  if (typeof question.answer === 'string') {
    question.htmlAnswer = marked.parse(question.answer)
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
