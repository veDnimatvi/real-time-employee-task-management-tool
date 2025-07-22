const { setGlobalOptions } = require("firebase-functions");
const { onRequest } = require("firebase-functions/https");
const express = require("express");
const cors = require("cors");
const route = require("./routes");

const app = express();
setGlobalOptions({ maxInstances: 10 });

app.use(express.json());
app.use(cors());

route(app);

exports.app = onRequest(app);
