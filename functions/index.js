const { setGlobalOptions } = require("firebase-functions");
const { onRequest } = require("firebase-functions/https");
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const route = require("./routes");

const app = express();
setGlobalOptions({ maxInstances: 10 });

app.use(express.json());
app.use(cors());

route(app);

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.locals.io = io;

io.on("connection", (socket) => {
  console.log("User connected");

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

exports.app = onRequest(app);
