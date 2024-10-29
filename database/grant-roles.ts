import { createStrapi } from '@strapi/strapi'
import type { Knex } from 'knex'
import { knex } from 'knex'
import path from 'path'

if (!process.env.DATABASE_READONLY_ROLES) {
  console.info('No role to grant')
  process.exit(0)
}

const { connection: databaseConfig } = createStrapi({
  distDir: path.join(__dirname, '..'),
}).config.get('database') as {
  connection: Knex.Config & {
    connection: Knex.ConnectionConfigProvider & { schema: string }
  }
}

const client = knex(databaseConfig)
const roles = process.env.DATABASE_READONLY_ROLES.split(',')

roles
  .reduce(
    (prom: Promise<unknown>, role) =>
      prom.then(() =>
        client.raw(
          `GRANT SELECT ON ALL TABLES IN SCHEMA "${databaseConfig.connection.schema}" TO "${role}";`
        )
      ),
    Promise.resolve()
  )
  .then(() => {
    console.info(`${roles.length} role(s) granted`)
    process.exit(0)
  })
  .catch((err) => {
    console.error('Grant error', err)
    process.exit(1)
  })
