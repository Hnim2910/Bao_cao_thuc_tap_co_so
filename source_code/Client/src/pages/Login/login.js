import React, { useState } from 'react';
import "./login.css";
import userApi from "../../apis/userApi";
import { useHistory, Link } from "react-router-dom";
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { Form, Input, Button, Modal, Divider, Alert, notification } from 'antd';

const Login = () => {
  const [isLogin, setLogin] = useState(true);
  const [forgotPasswordModalVisible, setForgotPasswordModalVisible] = useState(false);
  const [forgotPasswordForm] = Form.useForm();
  let history = useHistory();

  const onFinish = values => {
    userApi.login(values.email, values.password)
      .then(function (response) {
        if (response.user.role === "isClient" && response.user.status !== "noactive") {
          history.push("/home");
        } else {
          setLogin(false);
          notification["error"]({
            message: `Thông báo`,
            description: 'Bạn không có quyền truy cập vào hệ thống',
          });
        }
      })
      .catch(error => {
        setLogin(false);
        console.log("email or password error" + error);
      });
  }

  const showForgotPasswordModal = () => {
    setForgotPasswordModalVisible(true);
  };

  const handleForgotPasswordCancel = () => {
    setForgotPasswordModalVisible(false);
  };

  const handleForgotPasswordSubmit = async () => {
    try {
      const values = await forgotPasswordForm.validateFields();
      await userApi.forgotPassword({ email: values.email });
      notification.success({
        message: 'Thông báo',
        description: 'Đã gửi đường dẫn đổi mật khẩu qua email.',
      });
      setForgotPasswordModalVisible(false);
    } catch (error) {
      notification.error({
        message: 'Lỗi',
        description: 'Đã có lỗi xảy ra khi gửi đường dẫn đổi mật khẩu.',
      });
    }
  };

  return (
    <div className="login-page">
      <div className="login-form">
        <div className="login-header">
          <img src="https://i.namu.wiki/i/a3GkhQuvwxycyyNIHB1NyYbwBoGS_F97T7a5UpDWQpnn7RpltuCq7rTg9ydpB2-Irum_UE05LSyhWR9tsGTEwA.svg" alt="HealthBooker Logo" className="login-logo" />
          <h1 className="login-title">Chào mừng trở lại!</h1>
          <p className="login-subtitle">Vui lòng đăng nhập để tiếp tục</p>
        </div>

        {!isLogin && (
          <Alert
            className="login-alert"
            message="Tài khoản hoặc mật khẩu không chính xác"
            type="error"
            showIcon
          />
        )}

        <Form
          name="normal_login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <Form.Item
            name="email"
            className="login-form-item"
            rules={[
              {
                required: true,
                message: 'Vui lòng nhập email!',
              },
              {
                type: 'email',
                message: 'Email không hợp lệ!',
              },
            ]}
          >
            <Input
              prefix={<MailOutlined className="login-form-icon" />}
              placeholder="Email"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            className="login-form-item"
            rules={[
              {
                required: true,
                message: 'Vui lòng nhập mật khẩu!',
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="login-form-icon" />}
              placeholder="Mật khẩu"
              size="large"
            />
          </Form.Item>

          <Form.Item className="login-form-item">
            <Button type="primary" htmlType="submit" className="login-form-button">
              Đăng nhập
            </Button>
          </Form.Item>

          <div className="login-form-register">
            Chưa có tài khoản? 
            <Link to="/register">Đăng ký ngay</Link>
          </div>

          <Divider className="login-divider">hoặc</Divider>

          <Button
            className="login-form-button"
            onClick={showForgotPasswordModal}
          >
            Quên mật khẩu?
          </Button>
        </Form>
      </div>

      <Modal
          title="Quên mật khẩu"
          visible={forgotPasswordModalVisible}
          onCancel={handleForgotPasswordCancel}
          footer={[
            <Button key="back" onClick={handleForgotPasswordCancel}>
              Hủy
            </Button>,
            <Button key="submit" type="primary" onClick={handleForgotPasswordSubmit}>
              Gửi đường dẫn đổi mật khẩu
            </Button>,
          ]}
        >
          <Form
            name="forgot_password"
            onFinish={handleForgotPasswordSubmit}
            form={forgotPasswordForm}
          >
            <Form.Item
              name="email"
              rules={[
                {
                  type: 'email',
                  message: 'Email không hợp lệ',
                },
                {
                  required: true,
                  message: 'Vui lòng nhập email',
                },
              ]}
            >
              <Input prefix={<UserOutlined />} placeholder="Email" />
            </Form.Item>
          </Form>
        </Modal>
    </div>
  );
};

export default Login;



