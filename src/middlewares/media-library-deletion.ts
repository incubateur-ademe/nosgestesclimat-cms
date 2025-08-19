import type { Core } from '@strapi/strapi'

export default (): Core.MiddlewareHandler => (ctx, next) => {
  if (!ctx.state.user.roles.some(({ code }) => code === 'strapi-super-admin')) {
    return ctx.forbidden('You are not allowed to perform this action.')
  }
  return next()
}
