const { app } = require('./startup/server');
require('express-async-errors');
require('./startup/prod')(app);
require('./startup/db')();
require('./startup/routes')(app);
