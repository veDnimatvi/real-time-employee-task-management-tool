const { db } = require("../config/config.js");
const twilio = require("twilio");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const environment = require("../environments/environment.js");

const accountSid = environment.TWILIO_ACCOUNT_SID;
const authToken = environment.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: environment.MAIL_ADMIN,
    pass: environment.PASS_MAIL_ADMIN,
  },
});

const authController = {
  createAccessCodeSms: async (req, res) => {
    const { phone } = req.body;
    const generateNumber = Math.floor(Math.random() * 900000) + 100000;

    const findUser = await db
      .collection("users")
      .where("phone", "==", phone)
      .get();

    if (!findUser.empty) {
      const doc = findUser.docs[0];
      const data = doc.data();
      const accessCode = data.accessCode;
      if (!accessCode) {
        await doc.ref.update({ accessCode: generateNumber });
      }
    } else {
      // If user does not exist, create a new user with the phone number and access code
      await db.collection("users").add({
        phone,
        accessCode: generateNumber,
        role: "OWNER",
      });
    }

    await client.messages.create({
      body: `Your access code is ${generateNumber}`,
      from: environment.TWILIO_FROM_PHONE_NUMER,
      to: phone,
    });

    res.status(200).json({
      message: "Access code sent successfully",
    });
  },
  validateAccessCodeSms: async (req, res) => {
    const { phone, accessCode } = req.body;

    const findUser = await db
      .collection("users")
      .where("phone", "==", phone)
      .get();

    if (findUser.empty) {
      return res.status(404).json({ message: "Phone number not found" });
    }

    const doc = findUser.docs[0];
    const data = doc.data();

    if (data.accessCode === accessCode) {
      await doc.ref.update({ accessCode: "" });
      return res.status(200).json({ success: true });
    } else {
      return res.status(400).json({ message: "Invalid access code" });
    }
  },
  createAccessCodeEmail: async (req, res) => {
    const { email } = req.body;
    const generateNumber = Math.floor(Math.random() * 900000) + 100000;

    const findUser = await db
      .collection("users")
      .where("email", "==", email)
      .get();

    if (!findUser.empty) {
      const doc = findUser.docs[0];
      const data = doc.data();
      const accessCode = data.accessCode;
      if (!accessCode) {
        await doc.ref.update({ accessCode: generateNumber });
      }
    }

    await transporter.sendMail({
      from: environment.MAIL_ADMIN,
      to: email,
      subject: "Your Access Code",
      text: `Your access code is ${generateNumber}`,
    });

    res.status(200).json({
      message: "Access code sent successfully",
    });
  },
  validateAccessCodeEmail: async (req, res) => {
    const { email, accessCode } = req.body;

    const findUser = await db
      .collection("users")
      .where("email", "==", email)
      .get();

    if (findUser.empty) {
      return res.status(404).json({ message: "Email not found" });
    }

    const doc = findUser.docs[0];
    const data = doc.data();

    if (data.accessCode === accessCode) {
      await doc.ref.update({ accessCode: "" });
      return res.status(200).json({ success: true });
    } else {
      return res.status(400).json({ message: "Invalid access code" });
    }
  },
  registerForEmployee: async (req, res) => {
    const { name, email, password } = req.body;

    const findUser = await db
      .collection("users")
      .where("email", "==", email)
      .get();

    if (!findUser.empty) {
      const newUser = {
        name,
        password: await bcrypt.hash(password, 10),
      };

      const doc = findUser.docs[0];

      await doc.ref.update({ ...newUser });

      res.status(201).json({ success: true });
    } else {
      return res.status(400).json({ code: 400, message: "Not found" });
    }
  },
  login: async (req, res) => {
    const { name, password } = req.body;

    const findUser = await db
      .collection("users")
      .where("name", "==", name)
      .get();

    if (!findUser.empty) {
      const doc = findUser.docs[0];
      const data = doc.data();

      const isPasswordMatch = await bcrypt.compareSync(password, data.password);

      if (isPasswordMatch) {
        // Generate JWT token
        const token = jwt.sign(
          { id: doc.id, rule: data.rule },
          environment.SECRET_KEY,
          {
            expiresIn: "1h",
          }
        );

        res.status(200).json({ token, name: data.name, role: data.role });
      } else {
        return res.status(400).json({ message: "Invalid password" });
      }
    } else {
      return res.status(404).json({ message: "User not exist" });
    }
  },
  loginPhoneNumber: async (req, res) => {
    const { phone } = req.body;

    const findUser = await db
      .collection("users")
      .where("phone", "==", phone)
      .get();

    if (!findUser.empty) {
      const doc = findUser.docs[0];
      const data = doc.data();

      // Generate JWT token
      const token = jwt.sign(
        { id: doc.id, rule: data.rule },
        environment.SECRET_KEY,
        {
          expiresIn: "1h",
        }
      );

      res.status(200).json({ token, name: data.name, role: data.role });
    } else {
      return res.status(404).json({ message: "User not exist" });
    }
  },
};

module.exports = authController;
