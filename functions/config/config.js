var admin = require("firebase-admin");

var serviceAccount = require("./serviceAccountKey.json");
const e = require("express");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL:
    "https://employee-task-management-7589a-default-rtdb.asia-southeast1.firebasedatabase.app",
});

const db = admin.firestore();

exports.db = db;
exports.admin = admin;
