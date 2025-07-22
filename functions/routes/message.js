const express = require("express");
const router = express.Router();

const messageController = require("../controllers/messageCOntroller");
const middlewareController = require("../middlewares/middlewareController");

router.get(
  "/messages/:id",
  middlewareController.verifyToken,
  messageController.getMessage
);

router.post(
  "/messages",
  middlewareController.verifyToken,
  messageController.createMessage
);
module.exports = router;
