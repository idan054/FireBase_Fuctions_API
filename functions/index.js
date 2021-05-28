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

app.post("/", async (req, res) => {
  const user = req.body
  const collectionPath = user["collectionPath"] // Collection/DocReference/InnerCollection
  await admin.firestore().collection(collectionPath).add(user)

  res.status(201).send();
})
exports.database_post = functions.https.onRequest(app);

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
