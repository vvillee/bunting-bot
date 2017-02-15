if (!process.env.SLACK_TOKEN) {
  console.log('Error: Specify token in environment');
  process.exit(1);
}

_ = require('underscore');
require('./controllers/bot-controller');
require('./controllers/status-controller');
