// server.js
const exp = require('express');
const app = exp();
const mongoClient = require('mongodb').MongoClient;
require('dotenv').config();
const cors = require('cors');

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(exp.json());

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

app.use((err, req, res, next) => {
  res.send({message: "error", payload: err.message});
});

const port = process.env.PORT || 5000;

let server;
if (process.env.NODE_ENV !== 'test') {
  server = app.listen(port, () => console.log(`server starting at port ${port}`));
}

module.exports = { app, client, server }; 
