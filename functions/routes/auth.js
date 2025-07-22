const express = require("express");
const authController = require("../controllers/authController");
const router = express.Router();

router.post("/create-access-code", authController.createAccessCodeSms);
router.post("/validate-access-code", authController.validateAccessCodeSms);
router.post("/register-employee", authController.registerForEmployee);
router.post("/login", authController.login);
router.post("/loginPhoneNumber", authController.loginPhoneNumber);
module.exports = router;
