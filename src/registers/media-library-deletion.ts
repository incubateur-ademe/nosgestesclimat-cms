import type { Core } from '@strapi/strapi'

const deletionHandlers = new Set([
  'admin-file.destroy',
  'admin-folder-file.deleteMany',
  'content-api.destroy',
])

type UploadPluginRoute = Omit<Core.Route, 'handler'> & { handler: string }

export const registerMediaLibraryDeletionMiddleware = (strapi: Core.Strapi) =>
  [
    ...strapi.plugins['upload'].routes['admin'].routes,
    ...strapi.plugins['upload'].routes['content-api'].routes,
  ]
    .filter(({ handler }: UploadPluginRoute) => deletionHandlers.has(handler))
    .forEach((route) => {
      route.config = route.config || {}
      route.config.policies = route.config.policies || []
      route.config.middlewares = [
        ...(route.config.middlewares || []),
        'global::media-library-deletion',
      ]
    })
