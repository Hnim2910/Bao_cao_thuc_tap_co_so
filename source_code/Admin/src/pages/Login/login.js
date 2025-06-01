import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Alert, Button, Form, Input, Modal, notification } from 'antd';
import React, { useState } from 'react';
import { useHistory } from "react-router-dom";
import userApi from "../../apis/userApi";
import "./login.css";

const Login = () => {
  const [isLogin, setLogin] = useState(true);
  const [forgotPasswordModalVisible, setForgotPasswordModalVisible] = useState(false);
  const [forgotPasswordForm] = Form.useForm();
  let history = useHistory();

  const onFinish = values => {
    userApi.login(values.email, values.password)
      .then(function (response) {
        if (!response.status) {
          setLogin(false);
        } else {
          (async () => {
            try {
              if (response.user.status !== "noactive") {
                history.push("/dash-board");
              } else {
                notification["error"]({
                  message: 'Thông báo',
                  description: 'Bạn không có quyền truy cập vào hệ thống',
                });
              }
            } catch (error) {
              console.log('Failed to fetch ping role:' + error);
            }
          })();
        }
      })
      .catch(error => {
        console.log("email or password error" + error)
      });
  }

  const handleForgotPasswordSubmit = async () => {
    try {
      const values = await forgotPasswordForm.validateFields();
      const data = { "email": values.email };
      await userApi.forgotPassword(data);
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
      console.error('Forgot password error:', error);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-left">
          <div className="login-left-content">
            <h1 className="login-left-title">Chào mừng đến với Trauma Team</h1>
            <p className="login-left-description">
              Hệ thống quản lý y tế thông minh, giúp bạn tối ưu hóa quy trình làm việc và nâng cao chất lượng chăm sóc bệnh nhân.
            </p>
            <img 
              src="https://img.freepik.com/free-vector/medical-video-call-consultation-illustration_88138-415.jpg" 
              alt="Healthcare illustration"
              style={{ width: '100%', marginTop: '20px' }}
            />
          </div>
        </div>

        <div className="login-right">
          <Form
            name="login"
            className="login-form"
            onFinish={onFinish}
          >
            <div className="login-form-title">
              <h2>Đăng nhập</h2>
              <p>Vui lòng đăng nhập để tiếp tục</p>
            </div>

            {!isLogin && (
              <div className="login-error">
                <Alert
                  message="Tài khoản hoặc mật khẩu không chính xác"
                  type="error"
                  showIcon
                />
              </div>
            )}

            <Form.Item
              name="email"
              className="login-input"
              rules={[
                { required: true, message: 'Vui lòng nhập email!' },
                { type: 'email', message: 'Email không hợp lệ!' }
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Email"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="password"
              className="login-input"
              rules={[
                { required: true, message: 'Vui lòng nhập mật khẩu!' }
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Mật khẩu"
                size="large"
              />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" className="login-button">
                Đăng nhập
              </Button>
            </Form.Item>

            <div className="login-forgot">
              <a onClick={() => setForgotPasswordModalVisible(true)}>
                Quên mật khẩu?
              </a>
            </div>
          </Form>
        </div>
      </div>

      <Modal
        title="Quên mật khẩu"
        visible={forgotPasswordModalVisible}
        onCancel={() => setForgotPasswordModalVisible(false)}
        footer={[
          <Button key="back" onClick={() => setForgotPasswordModalVisible(false)}>
            Hủy
          </Button>,
          <Button key="submit" type="primary" onClick={handleForgotPasswordSubmit}>
            Gửi
          </Button>,
        ]}
      >
        <Form form={forgotPasswordForm}>
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Vui lòng nhập email!' },
              { type: 'email', message: 'Email không hợp lệ!' }
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


