const express = require('express')
const bodyParser = require('body-parser')
require('dotenv').config()
require('./server/utils/globalConfig');
const cors = require('cors')
const fs = require('fs')
const https = require('https');
const pemFilePath1 = './ourly.pem';
const pemFilePath2 = './ourlykey.pem';
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
new rem(objCollection).sendRemainderToProjectLeads()
// new rem(objCollection).sendProjectToInactive()

const pemFileContent1 = fs.readFileSync(pemFilePath1, 'utf8');
const pemFileContent2 = fs.readFileSync(pemFilePath2, 'utf8');
const options = {
  cert: pemFileContent1,
  key: pemFileContent2
};
const server = https.createServer(options, app);

const port = process.env.PORT
server.listen(port, () => console.log(`Server up and running on port ${port} !!!!..`));
