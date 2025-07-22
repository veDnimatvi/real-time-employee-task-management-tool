import { useEffect, useState } from "react";
import { deleteUser, getUser } from "../../api/user";
import { Button, message, Popconfirm, Space, Spin, Table } from "antd";
import FormUser from "./FormUser";

const User = () => {
  const [dataUser, setDataUser] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();
  const [openModal, setOpenModal] = useState(false);
  const [dataEdit, setDataEdit] = useState(false);

  const columns = [
    {
      title: "Employee Name",
      dataIndex: "name",
      fixed: "left",
      key: "name",
      width: 150,
    },
    {
      title: "Phone",
      dataIndex: "phone",
      fixed: "left",
      key: "phone",
      width: 150,
    },
    {
      title: "Email",
      dataIndex: "email",
      fixed: "left",
      key: "email",
      width: 150,
    },
    {
      title: "Active",
      dataIndex: "active",
      fixed: "left",
      key: "active",
      width: 150,
    },
    {
      title: "Action",
      dataIndex: "action",
      fixed: "left",
      key: "action",
      width: 150,
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="dashed"
            onClick={() => {
              setDataEdit(record);
              setOpenModal(true);
            }}>
            Edit
          </Button>
          <Popconfirm
            title="Delete this user"
            description="Are you sure to delete this user?"
            onConfirm={() => deleteUsers(record)}
            okText="Yes"
            cancelText="No">
            <Button danger>Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const deleteUsers = async (record) => {
    try {
      await deleteUser(record.id);
      messageApi.success("User deleted successfully");
      initData();
    } catch (error) {
      messageApi.error("Something went wrong. Please try again later.");
    }
  };

  const initData = async () => {
    try {
      const response = await getUser();
      setDataUser(response?.data);
    } catch (error) {
      messageApi.error("Something went wrong. Please try again later.");
    }
  };

  useEffect(() => {
    initData();
  }, []);

  return (
    <>
      {contextHolder}
      <div style={{ fontSize: 25, fontWeight: "bold", marginBottom: 10 }}>
        Manage Employee
      </div>
      <Space
        style={{
          marginBottom: 16,
          display: "flex",
          justifyContent: "space-between",
        }}>
        <Button onClick={() => setOpenModal(true)}>Create Employee</Button>
      </Space>
      <Table rowKey="id" columns={columns} dataSource={dataUser} />
      {openModal && (
        <FormUser
          openModal={openModal}
          setOpenModal={setOpenModal}
          dataEdit={dataEdit}
          setDataEdit={setDataEdit}
          initData={initData}
        />
      )}
    </>
  );
};

export default User;
