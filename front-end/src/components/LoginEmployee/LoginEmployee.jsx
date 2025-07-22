import { Button, Form, Input, message } from "antd";
import { useNavigate } from "react-router-dom";
import { loginApi } from "../../api/auth";
import { KEY, setCookie } from "../../utils/cookie";

const LoginEmployee = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const onFinish = async (values) => {
    try {
      const res = await loginApi(values);
      setCookie(KEY.TOKEN, res.data.token);
      setCookie(KEY.NAME, res.data.name);
      setCookie(KEY.ROLE, res.data.role);
      messageApi.success("Login successful!");
      navigate("/");
    } catch (error) {
      messageApi.error("Something went wrong. Please try again later.");
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
        <div style={{ textAlign: "center", margin: "50px", fontSize: 28 }}>
          Sign in
        </div>
        <Form
          form={form}
          onFinish={onFinish}
          layout="horizontal"
          labelAlign="left"
          labelWrap
          colon={false}>
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

export default LoginEmployee;
