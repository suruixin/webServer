const log4js = require('log4js');

log4js.configure({
  appenders: {
    out: { type: 'stdout' },
    cheese: { type: 'dateFile',
      filename: `./public/log/log`,
      pattern: '-yyyy-MM-dd.log',
      alwaysIncludePattern: true
    }
  },
  categories: {
    default: {
      appenders: ['out', 'cheese'],
      level: 'info'
    }
  }
});

const logger: any = log4js.getLogger()
logger.level = 'info'

module.exports = logger
