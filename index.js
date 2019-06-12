const createServer = require('./server')
const config = require('./server/config')
const LoggingService = require('./server/services/logging.service')

createServer()
  .then((server) => {
    config.server = server

    server.events.on('start', () => {
      LoggingService.logInfo(`Log level: ${config.loggingLevel}`)
    })

    return server.start()
  })
  .catch((err) => {
    console.log(err)
    process.exit(1)
  })
