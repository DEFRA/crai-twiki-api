const knex = require('knex')

const { DefaultAzureCredential, getBearerTokenProvider } = require('@azure/identity')

const { config } = require('../config')

const tokenProvider = getBearerTokenProvider(
  new DefaultAzureCredential({ managedIdentityClientId: config.get('platform.clientId') }),
  'https://ossrdbms-aad.database.windows.net/.default'
)

const database = knex({
  client: 'pg',
  connection: {
    host: config.get('database.host'),
    port: config.get('database.port'),
    user: config.get('database.user'),
    password: config.get('env') === 'production' ? tokenProvider : config.get('database.password'),
    database: config.get('database.name'),
    ssl: config.get('database.ssl')
  }
})

module.exports = {
  database
}
