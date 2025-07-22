const jwt = require("jsonwebtoken");
const ENVIRONMENT = require("../environments/environment");
const { db } = require("../config/config.js");

async function findRoleUser(id, role) {
  const findUser = await db.collection("users").doc(id).get();
  if (!findUser.exists) return false;
  return findUser.data().role === role;
}

const middlewareController = {
  verifyTokenOwner: (req, res, next) => {
    const token = req.headers.authorization;
    if (token) {
      const accessToken = token.split(" ")[1];
      jwt.verify(accessToken, ENVIRONMENT.SECRET_KEY, (err, user) => {
        if (err) {
          res.status(500).json({ message: "INTERNAL_SERVER_ERROR" });
        } else {
          req.user = user;
          findRoleUser(user.id, "OWNER").then((isOwner) => {
            if (!isOwner) {
              return res
                .status(401)
                .json({ status: 401, message: "UNAUTHORIZED" });
            }
            next();
          });
        }
      });
    } else {
      res.status(401).json({ status: 401, message: "UNAUTHORIZE" });
    }
  },
  verifyToken: (req, res, next) => {
    const token = req.headers.authorization;
    if (token) {
      const accessToken = token.split(" ")[1];
      jwt.verify(accessToken, ENVIRONMENT.SECRET_KEY, (err, user) => {
        if (err) {
          res.status(500).json({ message: "INTERNAL_SERVER_ERROR" });
        } else {
          req.user = user;
          next();
        }
      });
    } else {
      res.status(401).json({ status: 401, message: "UNAUTHORIZE" });
    }
  },
};

module.exports = middlewareController;
