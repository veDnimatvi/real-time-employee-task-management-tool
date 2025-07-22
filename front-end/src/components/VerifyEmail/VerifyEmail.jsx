import { Button, Form, Input, InputNumber, message } from "antd";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { registerForEmployee, validateAccessCodeEmail } from "../../api/auth";

const VerifyEmail = () => {
  const [form] = Form.useForm();
  const [searchParams] = useSearchParams();
  const EMAIL = searchParams.get("email");
  const [messageApi, contextHolder] = message.useMessage();
  const [accessCodeMode, setAccessCodeMode] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    const accessCode = values["accessCode"];
    const name = values["name"];
    const password = values["password"];

    if (!accessCodeMode) {
      try {
        const res = await validateAccessCodeEmail({ accessCode, email: EMAIL });
        if (res.data.success) {
          setAccessCodeMode(true);
          messageApi.success(
            "Access code validated successfully. Please create your username and password."
          );
        }
      } catch (err) {
        messageApi.error("Something went wrong. Please try again later.");
      }
    } else {
      try {
        const res = await registerForEmployee({ name, password, email: EMAIL });
        if (res.data.success) {
          setAccessCodeMode(true);
          messageApi.success("Registration successful! You can now log in.");
          navigate("/login-employee");
        }
      } catch (err) {
        messageApi.error("Something went wrong. Please try again later.");
      }
    }
  };

  return (
    <>
      {contextHolder}
      <div
        style={{
          width: "400px",
          margin: "10rem auto",
          padding: "50px",
          background: "#fff",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        }}>
        {!accessCodeMode ? (
          <>
            <p
              style={{ fontSize: 25, fontWeight: "bold", textAlign: "center" }}>
              Email verification
            </p>
            <p style={{ textAlign: "center", margin: "50px" }}>
              Please enter your code that send to your email addresss
            </p>
          </>
        ) : (
          <>
            <div style={{ textAlign: "center", margin: "50px", fontSize: 28 }}>
              Create your usename and password
            </div>
          </>
        )}

        <Form
          form={form}
          onFinish={onFinish}
          layout="horizontal"
          labelAlign="left"
          labelWrap
          colon={false}>
          {!accessCodeMode ? (
            <Form.Item
              name="accessCode"
              rules={[
                {
                  required: true,
                  message: "Please input your access code!",
                },
              ]}>
              <InputNumber
                size="large"
                style={{ width: "100%" }}
                placeholder="Enter your access code"
              />
            </Form.Item>
          ) : (
            <>
              <Form.Item
                name="name"
                label="Username"
                rules={[
                  {
                    required: true,
                    message: "Please input your user name!",
                  },
                ]}>
                <Input size="large" style={{ width: "100%" }} />
              </Form.Item>
              <Form.Item
                name="password"
                label="Password"
                rules={[
                  {
                    required: true,
                    message: "Please input your password!",
                  },
                ]}>
                <Input size="large" style={{ width: "100%" }} />
              </Form.Item>
            </>
          )}
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

export default VerifyEmail;
