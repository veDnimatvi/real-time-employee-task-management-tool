import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  PoweroffOutlined,
  UserOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { Menu, Col, Row, message } from "antd";
import { removeCookie, KEY, getCookie } from "../../../utils/cookie";
import { useEffect, useState } from "react";

function AdminLayout() {
  const navigate = useNavigate();
  const [role, setRole] = useState();
  const [_, contextHolder] = message.useMessage();
  let location = useLocation();

  const handleMenuClick = (e) => {
    if (e.key === "logOut") {
      removeCookie(KEY.TOKEN);
      removeCookie(KEY.PHONE);
      removeCookie(KEY.NAME);
      removeCookie(KEY.ROLE);
      navigate(role === "OWNER" ? "/login" : "/login-employee");
    } else {
      navigate(e.key);
    }
  };

  useEffect(() => {
    setRole(getCookie(KEY.ROLE));
  }, []);

  return (
    <>
      {contextHolder}
      <h1>Task Manage Tool</h1>
      <Row>
        <Col flex="200px">
          <Menu
            style={{ padding: "5px", width: 250, height: "95vh" }}
            onClick={handleMenuClick}
            theme="light"
            defaultSelectedKeys={[
              location?.pathname?.split("/")?.[2]
                ? location?.pathname
                : location?.pathname?.split("/")?.[1],
            ]}
            defaultOpenKeys={[location?.pathname?.split("/")?.[1]]}
            mode="inline">
            <Menu.Item key="" icon={<HomeOutlined />}>
              Home
            </Menu.Item>
            {role === "OWNER" && (
              <Menu.Item key="manage-user" icon={<UserOutlined />}>
                Manage Employee
              </Menu.Item>
            )}
            <Menu.Item key="manage-task" icon={<UserOutlined />}>
              Manage Task
            </Menu.Item>
            <Menu.Item key="logOut" icon={<PoweroffOutlined />} danger>
              Log out
            </Menu.Item>
          </Menu>
        </Col>
        <Col flex="auto">
          <div style={{ width: "100%", padding: "0 20px" }}>
            <Outlet />
          </div>
        </Col>
      </Row>
    </>
  );
}

export default AdminLayout;
