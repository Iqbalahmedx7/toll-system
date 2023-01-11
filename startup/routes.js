const error = require("../middleware/error");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const interchangeRoutes = require('../routes/interchange.js');
const tollRoutes = require('../routes/toll.js'); 


module.exports = function (app) {
  app.use(cors());
  app.use(morgan("tiny"));
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json()); 
  app.use(error);
  app.use('/api/interchange', interchangeRoutes);
  app.use('/api/toll', tollRoutes);  
};
