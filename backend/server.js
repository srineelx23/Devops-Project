// server.js
const exp = require('express');
const app = exp();
const mongoClient = require('mongodb').MongoClient;
require('dotenv').config();
const cors = require('cors');
const clientpm = require('prom-client'); // ✅ Prometheus client
const { createLogger, transports } = require("winston");
const LokiTransport = require("winston-loki");
const options = {
  transports: [
    new LokiTransport({
      host: "http://127.0.0.1:3100"
    })
  ]
};
const logger = createLogger(options);
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(exp.json());

const collectDefaultMetrics=clientpm.collectDefaultMetrics;
collectDefaultMetrics({register: clientpm.register})

app.get('/',(req,res)=>{
  logger.info(('Req came on / root'))
  return res.json({message:"Hello from express"})
});

app.get('/metrics',async (req,res)=>{
  res.setHeader('Content-Type', clientpm.register.contentType)
  const metrics=await clientpm.register.metrics();
  res.send(metrics);
});

// ---- Existing MongoDB Connection Logic ----
let client; // ✅ Track the client globally

mongoClient.connect(process.env.DB_URL)
  .then(mongoClientInstance => {
    client = mongoClientInstance; // ✅ Save client
    const dbObj = client.db('budgetdb');
    const userscollection = dbObj.collection('usersBTcollection');
    const purchasehistory = dbObj.collection('purchasehistorycollection');
    app.set('userscollection', userscollection);
    app.set('purchasehistory', purchasehistory);
    console.log("connection to DB successful");
  })
  .catch(err => console.log("error is ", err));

const userapp = require('./APIs/user-api');
app.use('/user-api', userapp);

// Error Handler
app.use((err, req, res, next) => {
  res.send({ message: "error", payload: err.message });
});

// ---- Server Setup ----
const port = process.env.PORT || 4000;

let server;
if (process.env.NODE_ENV !== 'test') {
  server = app.listen(port, () => console.log(`server starting at port ${port}`));
}

module.exports = { app, client, server };
