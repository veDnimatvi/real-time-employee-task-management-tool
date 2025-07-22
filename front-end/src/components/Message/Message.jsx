import { useEffect, useState } from "react";
import { getAllUser } from "../../api/user";
import { Avatar, Button, Col, Input, message, Row } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { apiSendMessage, getMessage } from "../../api/message";
import io from "socket.io-client";

const Message = () => {
  const [dsUser, setDsUser] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();
  const [dsMessage, setDsMessage] = useState([]);
  const [receiver, setReceiver] = useState();
  const [text, setText] = useState();
  const getAllUsers = async () => {
    try {
      const res = await getAllUser();
      setDsUser(res.data);
    } catch (error) {
      messageApi.error("Something went wrong. Please try again later.");
    }
  };
  const getAllMessages = async (receiverId) => {
    try {
      setReceiver(receiverId);
      const res = await getMessage(receiverId);
      setDsMessage(res.data);
    } catch (error) {
      messageApi.error("Something went wrong. Please try again later.");
    }
  };

  const sendMessage = async () => {
    try {
      const res = await apiSendMessage({
        receiverId: receiver,
        content: text,
      });
      if (res.data.created) {
        setText("");
      }
    } catch (error) {
      messageApi.error("Something went wrong. Please try again later.");
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  useEffect(() => {
    const socket = io("http://127.0.0.1:5001");

    socket.on("connect", () => {
      console.log("Conected to server");
    });

    socket.on("new_message", () => {
      if (receiver) {
        getAllMessages(receiver);
      }
    });
  }, []);

  return (
    <>
      {contextHolder}
      {dsUser.length > 0 && (
        <Row gutter={24}>
          <Col span={4}>
            {dsUser.map((user) => (
              <div
                key={user.id}
                style={{
                  padding: 10,
                  marginBottom: "10px",
                  background: user.id === receiver ? "blue" : "#f0f0f0",
                  color: user.id === receiver ? "white" : "black",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
                onClick={() => getAllMessages(user.id)}>
                <Avatar size={32} icon={<UserOutlined />} />
                <strong style={{ marginLeft: 10 }}>
                  {user.name || user.email || user.phone}
                </strong>
              </div>
            ))}
          </Col>
          <Col
            span={15}
            style={{
              background: "#f0f0f0",
              paddding: 20,
              height: "80vh",
              overflowY: "auto",
            }}>
            <div style={{ position: "relative", height: "80vh" }}>
              {dsMessage.length < 1 ? (
                <p>Empty Message</p>
              ) : (
                <div style={{ height: "90%", overflowY: "auto" }}>
                  {dsMessage.map((message) => (
                    <div
                      key={message.id}
                      style={{
                        padding: 10,
                        marginBottom: "10px",

                        background:
                          message.receiverId === receiver
                            ? "lightblue"
                            : "#e0e0e0",
                        borderRadius: "4px",
                        marginLeft:
                          message.receiverId === receiver ? "auto" : "0",
                        marginRight:
                          message.receiverId === receiver ? "0" : "auto",
                        maxWidth: "70%",
                        textAlign:
                          message.receiverId === receiver ? "right" : "left",
                      }}>
                      <strong>
                        {message.receiverId === receiver ? "You" : "Them"}:
                      </strong>
                      <p>{message.content}</p>
                    </div>
                  ))}
                </div>
              )}
              <div
                style={{
                  position: "absolute",
                  bottom: 10,
                  left: 0,
                  right: 0,
                  padding: "10px",
                  background: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderTop: "1px solid #ccc",
                }}>
                <input
                  style={{
                    width: "80%",
                    padding: "10px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                  }}
                  placeholder="Type a message..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
                <Button onClick={sendMessage}>Send</Button>
              </div>
            </div>
          </Col>
        </Row>
      )}
    </>
  );
};

export default Message;
