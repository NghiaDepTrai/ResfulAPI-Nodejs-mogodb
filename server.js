const express = require('express');
const mongoose = require('mongoose');
const app = express();
const productsRouter = require('./routes/products');
const ordersRouter = require('./routes/orders');
const port = process.env.PORT || 3000;
const morgan = require('morgan');
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/";

app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    return res.status(200).json({});
  }
  next();
});

app.use('/products', productsRouter);
app.use('/orders', ordersRouter);




MongoClient.connect(url, { useNewUrlParser: true }, (err, db) => {
  if (err) throw err;
  var dbo = db.db("mydb");
  dbo.createCollection("customers", (err, res) => {
    if (err) throw err;
    console.log("Collection created!");
    db.close();
  });
});

mongoose.Promise=global.Promise;

app.listen(port, () => {
  console.log('someone connected !');
});