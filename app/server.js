require('./insights').setup()
const Hapi = require('@hapi/hapi')
const { config } = require('./config')

const server = Hapi.server({
  port: config.get('port')
})

const routes = [].concat(
  require('./routes/healthy'),
  require('./routes/healthz'),
  require('./routes/projects')
)

server.route(routes)

module.exports = server
