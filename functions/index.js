const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");

const admin = require("firebase-admin");
admin.initializeApp();

// const functions = require("firebase-functions");
// const express = require("express");
// const cors = require("cors");
// const admin = require("firebase-admin")

const app = express();

// Firebase functions not have POST GET (?) , so we make it.
app.get('/', async (req,
               res) => {
  // const {collection} = req.query;

  //etc. example.com/user/000000?sex=female
  const query = req.query;// query = {sex:"female"}
  const collectionPath = query["collectionPath"] // Collection/DocReference/InnerCollection

  const params = req.params; //params = {id:"000000"}
  // const collectionPath = params["collectionPath"] // Collection/DocReference/InnerCollection

  // const reqBody = req.body
  // const collectionPath = reqBody["collectionPath"] // Collection/DocReference/InnerCollection

  // My Get req.url: https://us-central1-bubbleflow-mitmit.cloudfunctions.net/database_GetPost?collectionPath=users

  const snapshot = await admin.firestore().collection(collectionPath).get();

  let users = [];
  snapshot.forEach(doc => {
    let id = doc.id;
    let createTime = doc.createTime;
    let data = doc.data();

    users.push({id, ...data, createTime})
  });

  res.status(201).send(JSON.stringify(users));

})

app.post("/", async (req, res) => {
  const reqBody = req.body
  const collectionPath = reqBody["collectionPath"] // Collection/DocReference/InnerCollection
  await admin.firestore().collection(collectionPath).add(reqBody)

  res.status(201).send();
})
exports.database_GetPost = functions.https.onRequest(app);

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
