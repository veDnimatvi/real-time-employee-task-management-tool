const express = require("express");
const authController = require("../controllers/authController");
const router = express.Router();

router.post("/create-access-code", authController.createAccessCodeSms);
router.post("/create-access-email", authController.createAccessCodeEmail);
router.post("/validate-access-code", authController.validateAccessCodeSms);
router.post("/validate-access-email", authController.validateAccessCodeEmail);
router.post("/register-employee", authController.registerForEmployee);
router.post("/login", authController.login);
router.post("/login-phone-number", authController.loginPhoneNumber);
module.exports = router;
