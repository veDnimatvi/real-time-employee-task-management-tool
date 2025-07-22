import { Button, Form, Input, message, Modal } from "antd";
import { useEffect } from "react";
import { createUser, updateUser } from "../../api/user";
import { createAccessCodeEmail } from "../../api/auth";

const FormUser = ({
  openModal,
  setOpenModal,
  dataEdit,
  setDataEdit,
  initData,
}) => {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const onFinish = () => {
    form.validateFields().then(async () => {
      const values = form.getFieldsValue();
      try {
        const response = dataEdit
          ? await updateUser(values, dataEdit.id)
          : await createUser(values);
        if (response.status === 201) {
          messageApi.success(
            dataEdit ? "Updated successfully" : "Created successfully"
          );
          setOpenModal(false);
          setDataEdit();
          initData();
          form.resetFields();
          if (!dataEdit) {
            await createAccessCodeEmail({
              email: values.email,
            });
          }
        }
      } catch (error) {
        messageApi.error("Something went wrong. Please try again later.");
      }
    });
  };

  useEffect(() => {
    form.setFieldsValue({
      role: "EMPLOYEE",
    });
    if (dataEdit) {
      form.setFieldsValue(dataEdit);
    }
  }, []);

  return (
    <>
      {contextHolder}
      <Modal
        maskClosable={false}
        open={openModal}
        title={dataEdit ? "Edit User" : "Create User"}
        onCancel={() => {
          setOpenModal(false);
          setDataEdit();
          form.resetFields();
        }}
        footer={
          <Button onClick={onFinish}>{dataEdit ? "Save" : "Create"}</Button>
        }>
        <Form
          form={form}
          layout="horizontal"
          labelAlign="left"
          labelCol={{ span: 8 }}
          colon={false}>
          <Form.Item name="name" label="Employee name">
            <Input />
          </Form.Item>
          <Form.Item name="phone" label="Phone Number">
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email Adress"
            rules={[
              {
                type: "email",
                message: "The input is not valid E-mail!",
              },
              {
                required: true,
                message: "Please input your E-mail!",
              },
            ]}>
            <Input />
          </Form.Item>
          <Form.Item name="role" label="Role">
            <Input disabled />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default FormUser;
