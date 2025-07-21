const { setGlobalOptions } = require("firebase-functions");
const { onRequest } = require("firebase-functions/https");
const express = require("express");
const { db } = require("./config/config.js");

const app = express();
setGlobalOptions({ maxInstances: 10 });

exports.app = onRequest(app);

app.get("/users", async (req, res) => {
  const users = [];
  const user = await db.collection("users").get();
  user.forEach((doc) => {
    users.push(doc.data());
  });
  res.status(200).send(users);
});

app.post("/users", async (req, res) => {
  try {
    const userRef = await db.collection("users").add(req.body);
    res.status(201).json({
      message: "Created successfully",
      data: { id: userRef.id, ...req.body },
    });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Error creating user", error: error.message });
  }
});
