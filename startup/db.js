require('dotenv').config();
const logger = require('../startup/logging');
const mongoose = require('mongoose');
const { DateTime } = require('luxon');
const { DB_URI } = require('../config/custom-environment-variables.json');

module.exports = function () {
  mongoose.set('strictQuery', true);
  mongoose
    // you can set DB_URI in env file too and access it via process.env.DB_URI
    .connect(DB_URI + '/toll_system', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log(
        DateTime.local().toLocaleString(DateTime.DATETIME_HUGE_WITH_SECONDS),
      );
      logger.info('Connected to MongoDB...');
    })
    .catch((err) => {
      console.log('Error Connecting to Mongo', err);
    });
};
