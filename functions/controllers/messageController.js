const { db } = require("../config/config.js");

const messageController = {
  getMessage: async (req, res) => {
    const { id } = req.params;

    try {
      const snapshotSend = await db
        .collection("message")
        .where("receiverId", "==", id)
        .where("senderId", "==", req.user.id)
        .get();

      const snapshotReceiver = await db
        .collection("message")
        .where("receiverId", "==", req.user.id)
        .where("senderId", "==", id)
        .get();

      const messages = [];
      await snapshotSend.forEach((doc) => {
        messages.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      await snapshotReceiver.forEach((doc) => {
        messages.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      messages.sort(
        (a, b) =>
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );
      return res.status(200).json(messages);
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error fetching messages", error });
    }
  },
  createMessage: async (req, res) => {
    const { receiverId, content } = req.body;

    const io = req.app.locals.io;

    const newMessage = {
      senderId: req.user.id,
      receiverId,
      content,
      timestamp: new Date().toISOString(),
    };

    try {
      await db.collection("message").add(newMessage);
      io.emit("new_message", newMessage);
      return res.status(201).json({ created: true });
    } catch (error) {
      return res.status(500).json({ message: "Error creating message", error });
    }
  },
};
module.exports = messageController;
