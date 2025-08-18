import type { Core } from '@strapi/strapi'
import { registerMediaLibraryDeletionMiddleware } from './registers/media-library-deletion'

export default {
  register({ strapi }: { strapi: Core.Strapi }) {
    registerMediaLibraryDeletionMiddleware(strapi)
  },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap(/* { strapi }: { strapi: Core.Strapi } */) {},
}
