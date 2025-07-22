const authRouter = require("./auth");
const userRouter = require("./user");
const messageRouter = require("./message");

function route(app) {
  app.use("/api/auth", authRouter);
  app.use("/api", userRouter);
  app.use("/api", messageRouter);
}

module.exports = route;
