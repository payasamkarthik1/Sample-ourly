const express = require('express')
const bodyParser = require('body-parser')
require('dotenv').config()
require('./server/utils/globalConfig');
const cors = require('cors')
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 1;
// process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
var corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200, // For legacy browser support
};



const app = express()

app.use(cors(corsOptions));

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

const Util = require('./server/utils/util')
const util = new Util()
const Db = require('./server/utils/dbConfig')
const db = new Db();
const ResponseWrapper = require('./server/utils/responseWrapper')
const responseWrapper = new ResponseWrapper(util)


var objCollection = {
  app: app,
  util: util,
  db: db,
  responseWrapper: responseWrapper
};


const ControllInterceptor = require('./server/interceptors/controllerInterceptors');
new ControllInterceptor(objCollection);

const rem = require('./server/utils/sheduler');
new rem(objCollection).sendRemainder()
new rem(objCollection).sendRemainderToLeads()

// new rem(objCollection).sendRemainderToLeadsEmergingLead()


const port = process.env.PORT
app.listen(port, () => console.log(`Server up and running on port ${port} !!!!..`));
