import { Button, Form, Input, InputNumber, message } from "antd";
import { useNavigate } from "react-router-dom";
import { KEY, setCookie } from "../../utils/cookie";
import {
  createAccessCodeSms,
  loginNumberApi,
  validateAccessCodeSms,
} from "../../api/auth";
import { useState } from "react";

const Login = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [accessCodeMode, setAccessCodeMode] = useState(false);

  const onFinish = async (values) => {
    const phone = values["phone"];
    const accessCode = values["accessCode"];

    if (!accessCodeMode) {
      try {
        const res = await createAccessCodeSms({ phone });
        if (res.data.code === 200) {
          setAccessCodeMode(true);
          messageApi.success(
            "Access code sent successfully. The access code is sent to the phone number via text message"
          );
        }
      } catch (err) {
        messageApi.error("Something went wrong. Please try again later.");
      }
    } else {
      try {
        const res = await validateAccessCodeSms({ phone, accessCode });
        if (res.data.success) {
          const response = await loginNumberApi({ phone });
          setCookie(KEY.TOKEN, response.data.token);
          setCookie(KEY.PHONE, phone);
          setCookie(KEY.ROLE, response.data.role);
          messageApi.success("Login successful!");
          navigate("/");
        }
      } catch (error) {
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
            <div style={{ textAlign: "center", margin: "50px", fontSize: 28 }}>
              Sign in
            </div>
            <p style={{ textAlign: "center", margin: "50px" }}>
              Please enter your phone to sign in
            </p>
          </>
        ) : (
          <>
            <div style={{ textAlign: "center", margin: "50px", fontSize: 28 }}>
              Phone verification
            </div>
            <p style={{ textAlign: "center", margin: "50px" }}>
              Please enter your code that send to your phone
            </p>
          </>
        )}
        <Form
          form={form}
          onFinish={onFinish}
          layout="horizontal"
          labelAlign="left"
          labelWrap
          colon={false}>
          <Form.Item
            name="phone"
            rules={[
              {
                required: true,
                message: "Please input your phone number!",
              },
              {
                pattern: /^\d{10}$/,
                message: "Phone number must be exactly 10 digits!",
              },
            ]}>
            <Input
              size="large"
              style={{ width: "100%" }}
              disabled={accessCodeMode}
              placeholder="Enter your phone number"
            />
          </Form.Item>
          {accessCodeMode && (
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

export default Login;
