const { db } = require("../config/config.js");

const userController = {
  getUsers: async (req, res) => {
    const users = [];

    const user = await db
      .collection("users")
      .where("role", "==", "EMPLOYEE")
      .get();

    user.forEach((doc) => {
      users.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    res.status(200).send(users);
  },
  createUser: async (req, res) => {
    try {
      await db.collection("users").add(req.body);
      res.status(201).json({
        status: 201,
        message: "Created successfully",
      });
    } catch (error) {
      return res
        .status(500)
        .send({ message: "Error creating user", error: error.message });
    }
  },
  updateUser: async (req, res) => {
    const id = req.params.id;
    const updateData = req.body;

    try {
      await db.collection("users").doc(id).update(updateData);
      res.status(201).json({
        status: 201,
        message: "Updated successfully",
      });
    } catch (error) {
      return res
        .status(500)
        .send({ message: "Error creating user", error: error.message });
    }
  },
  deleteUser: async (req, res) => {
    const id = req.params.id;

    try {
      await db.collection("users").doc(id).delete();
      res.status(201).json({
        status: 201,
        message: "Deleted successfully",
      });
    } catch (error) {
      return res
        .status(500)
        .send({ message: "Error creating user", error: error.message });
    }
  },
};
module.exports = userController;
