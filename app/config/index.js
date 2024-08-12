const convict = require('convict')

const config = convict({
  env: {
    doc: 'The application environment.',
    format: ['production', 'development'],
    default: 'development',
    env: 'NODE_ENV'
  },
  port: {
    doc: 'The port to bind.',
    format: 'port',
    default: 3000,
    env: 'PORT'
  },
  database: {
    host: {
      doc: 'Database host name',
      format: '*',
      default: 'localhost',
      env: 'POSTGRES_HOST'
    },
    port: {
      doc: 'Database port',
      format: 'port',
      default: 5432,
      env: 'POSTGRES_PORT'
    },
    user: {
      doc: 'Database user',
      format: String,
      default: 'postgres',
      env: 'POSTGRES_USER'
    },
    password: {
      doc: 'Database password',
      format: String,
      default: 'ppp',
      env: 'POSTGRES_PASSWORD'
    },
    name: {
      doc: 'Database name',
      format: String,
      default: 'postgres',
      env: 'POSTGRES_DB'
    },
    ssl: {
      doc: 'Use SSL to connect to the database',
      format: Boolean,
      default: process.env.NODE_ENV === 'production'
    }
  },
  platform: {
    clientId: {
      doc: 'The client ID for the managed identity',
      format: String,
      env: 'AZURE_CLIENT_ID'
    }
  }
})

module.exports = {
  config
}
