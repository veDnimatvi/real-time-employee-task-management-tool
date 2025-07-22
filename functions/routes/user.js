const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const middlewareController = require("../middlewares/middlewareController");

router.get(
  "/users",
  middlewareController.verifyTokenOwner,
  userController.getUsers
);
router.post(
  "/users",
  middlewareController.verifyTokenOwner,
  userController.createUser
);
router.delete(
  "/users/:id",
  middlewareController.verifyTokenOwner,
  userController.deleteUser
);
router.put(
  "/users/:id",
  middlewareController.verifyToken,
  userController.updateUser
);
module.exports = router;
