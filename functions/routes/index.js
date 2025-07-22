const authRouter = require("./auth");
const userRouter = require("./user");

function route(app) {
  app.use("/api/auth", authRouter);
  app.use("/api", userRouter);
}

module.exports = route;
