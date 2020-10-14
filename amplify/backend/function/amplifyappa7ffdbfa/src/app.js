var express = require('express')
var bodyParser = require('body-parser')
var awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')

// declare a new express app
var app = express()
app.use(bodyParser.json())
app.use(awsServerlessExpressMiddleware.eventContext())

const AWS = require('aws-sdk')
const docClient = new AWS.DynamoDB.DocumentClient();
const STORAGE_TABLE_NAME = 'dynamo845287cf-dev';

// Enable CORS for all methods
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next()
});

app.get('/subscriber', function(req, res) {
  const id = req.query.id;

  if (!id) return res.json({ error: 'Required `ID` query param' });

  const params = {
    TableName: STORAGE_TABLE_NAME,
    FilterExpression: 'recordID = :id',
    ExpressionAttributeValues: {':id': id },
  }
  docClient.scan(params, function(err, data) {
    if (err) res.json({ err })
    else res.json({ data })
  })
});

app.post('/subscriber', function(req, res) {
  const generatedId = id();
  const params = {
    TableName : STORAGE_TABLE_NAME,
    Item: {
      recordID: generatedId,
      email: req.body.email,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      profileImage: req.body.profileImage
    }
  }
  docClient.put(params, (err, data) => {
    if (err) res.json({ err })
    else res.json({ success: 'Account created successfully!', id: generatedId })
  })
});

app.listen(3000, function() {
  console.log("App started")
});

function id () {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app
