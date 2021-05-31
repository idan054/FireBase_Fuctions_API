// How I Made it: https://www.youtube.com/watch?v=iIVlRZIo2-c&t=591s

const functions = require("firebase-functions");
const express = require("express");
// const cors = require("cors");
const moment = require("moment")

const admin = require("firebase-admin");
admin.initializeApp();

// const functions = require("firebase-functions");
// const express = require("express");
// const cors = require("cors");
// const admin = require("firebase-admin")

const collections_app = express();
const document_app = express();

  function currentTime()  {
    // var created_Time  = moment().utcOffset(0, true).format()
    let currentTimeStr  = Date()
    let currentTimeNum = Math.floor(new Date() / 1000)

  return { currentTimeStr, currentTimeNum} ;
}

// Get Specific data by choose document
document_app.get('/', async (req,
               res) => {

  //etc. example.com/user/000000?sex=female
  const query = req.query;// query = {sex:"female"}
  const collectionPath = query["collectionPath"] // Collection/DocReference/InnerCollection
  const doc = query["doc"]
  const last_edit = exports.currentTime()


  const snapshot = await admin.firestore().collection(collectionPath).doc(doc).get();

    let req_doc = snapshot.id;
    // let createTime = snapshot.createTime;
    let data = snapshot.data();

  res.status(201).send(JSON.stringify({
    "req_doc":req_doc,
    "last_edit": last_edit,
    data}
    ));

})

// Put (update) data by choose document
document_app.put('/', async (req,
               res) => {

  //etc. example.com/user/000000?sex=female
  const query = req.query; // query = {sex:"female"}
  const collectionPath = query["collectionPath"] // Collection/DocReference/InnerCollection
  const doc = query["doc"]

  const  currentTimeStr = currentTime()["currentTimeStr"]
  const  currentTimeNum = currentTime()["currentTimeNum"]

  const reqBody = req.body
  await admin.firestore().collection(collectionPath).doc(doc).update(
{ "last_edit_str": currentTimeStr,
        "last_edit_num": currentTimeNum,
        ...reqBody},  // "..." to ignore reqBody{}
    );

  res.status(201).send({
      "doc_ref": doc,
      "last_edit_str": currentTimeStr,
      "last_edit_num": currentTimeNum,
      ...reqBody}); // "..." to ignore reqBody{}
  //  Cannot .send(JSON.stringify(snapshot.data())) because its not a get Request
})

// Delete chosen document
document_app.delete('/', async (req,
               res) => {

  //etc. example.com/user/000000?sex=female
  const query = req.query;// query = {sex:"female"}
  const collectionPath = query["collectionPath"] // Collection/DocReference/InnerCollection
  const doc = query["doc"]

  await admin.firestore().collection(collectionPath).doc(doc).delete();

  res.status(201).send();
})

// Get full data by choose collections
collections_app.get('/', async (req,
               res) => {
  // const {collection} = req.query;

  //etc. example.com/user/000000?sex=female
  const query = req.query;// query = {sex:"female"}
  const collectionPath = query["collectionPath"] // Collection/DocReference/InnerCollection

  // const params = req.params; //params = {id:"000000"}
  // // const collectionPath = params["collectionPath"] // Collection/DocReference/InnerCollection

  // const reqBody = req.body
  // const collectionPath = reqBody["collectionPath"] // Collection/DocReference/InnerCollection

  // My Get req.url: https://us-central1-bubbleflow-mitmit.cloudfunctions.net/database_GetPost?collectionPath=users

  // const reqBody = req.body
  // const collectionPath = reqBody["collectionPath"] // Collection/DocReference/InnerCollection

  const snapshot = await admin.firestore().collection(collectionPath).get();

  let users = [];
  snapshot.forEach(doc => {
    // let id = doc.id;
    // let createTime = doc.createTime;
    let data = doc.data();

    // users.push({id, ...data, createTime})
    users.push({...data}) //"...data" to: "email": "ccc@ccc.com" Instead: "data": { "email": "ccc@ccc.com", }
  });

  res.status(201).send(JSON.stringify(users));
})

// Post any data by req.body & choose collections
collections_app.post("/", async (req, res) => {
  const reqBody = req.body
  const collectionPath = reqBody["collectionPath"] // Collection/DocReference/InnerCollection

  const currentTimeStr = currentTime()["currentTimeStr"]
  const currentTimeNum = currentTime()["currentTimeNum"]

  // await admin.firestore().collection(collectionPath).doc(doc_id).set(reqBody)
  const snapshot = await admin.firestore().collection(collectionPath).add(reqBody);


  await admin.firestore().collection(collectionPath).doc(snapshot.id)
      .update({
        "doc_ref":snapshot.id,
        "created_time_str":currentTimeStr,
        "created_time_num":currentTimeNum,
        "last_edit_str": currentTimeStr,
        "last_edit_num": currentTimeNum,
      }); // Add the doc id

    // 100-199: (Informational) Missing data error "collectionPath is missing on reqBody"
    // 200-299: (Success)
    // 300-399: (Redirection) No permission error "You have no permission to charge"
    // 400-499: (Client error) User error like "Pass needs to be at least 6 char"
    // 500-599: (Server error)


  res.status(201).send({
        "doc_ref":snapshot.id,
        "created_time_str":currentTimeStr,
        "created_time_num":currentTimeNum,
        "last_edit_str": currentTimeStr,
        "last_edit_num": currentTimeNum,
      ...reqBody});  // "..." to ignore reqBody{}
//  Cannot .send(JSON.stringify(snapshot.data())) because its not a get Request

})

exports.GetPost_Collections = functions.https.onRequest(collections_app);

exports.GetPutDelete_doc = functions.https.onRequest(document_app);
// Use    firebase deploy --only functions    to update on cloud

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
