import React, { useState, useEffect } from "react";
import "./register.css";
import { DatePicker, Input } from 'antd';
import { Card, Table, Space, Tag, PageHeader, Divider, Form, Button, notification } from 'antd';
import { UserOutlined, LockOutlined, PhoneOutlined, MailOutlined, AimOutlined, MoneyCollectOutlined } from '@ant-design/icons';
import { useHistory, Link } from "react-router-dom";
import axiosClient from "../../apis/axiosClient";

const { Search } = Input;

const RegisterCustomer = () => {

    const [delivery, setDelivery] = useState([]);
    let history = useHistory();

    const onFinish = async (values) => {
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();
        var date = yyyy + "-" + mm + "-" + dd;

        try {
            const formatData = {
                "email": values.email,
                "username": values.username,
                "password": values.password,
                "phone": values.phoneNo,
                "role": "isClient",
                "status": "actived"
            }
            await axiosClient.post("http://localhost:3100/api/auth/register", formatData)
                .then(response => {
                    console.log(response);
                    if (response === "Email is exist") {
                        return notification["error"]({
                            message: "Thông báo",
                            description: "Email đã tồn tại",

                        });
                    }
                    if (response === undefined) {
                        notification["error"]({
                            message: "Thông báo",
                            description: "Đăng ký thất bại",

                        });
                    }
                    else {
                        notification["success"]({
                            message: "Thông báo",
                            description: "Đăng kí thành công",
                        });
                        setTimeout(function () {
                            history.push("/login");
                        }, 1000);
                    }
                }
                );
        } catch (error) {
            throw error;
        }
    }
    return (
        <div className="register-page">
            <div className="register-form">
                <div className="register-header">
                    <img src="https://i.namu.wiki/i/a3GkhQuvwxycyyNIHB1NyYbwBoGS_F97T7a5UpDWQpnn7RpltuCq7rTg9ydpB2-Irum_UE05LSyhWR9tsGTEwA.svg" className="register-logo" />
                    <h1 className="register-title">Tạo tài khoản mới</h1>
                    <p className="register-subtitle">Điền thông tin của bạn để đăng ký</p>
                </div>

                <Form
                    name="register_form"
                    onFinish={onFinish}
                    layout="vertical"
                >
                    <Form.Item
                        name="username"
                        className="register-form-item"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập tên hiển thị!',
                            },
                        ]}
                    >
                        <Input 
                            prefix={<UserOutlined className="register-form-icon" />}
                            placeholder="Tên hiển thị"
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item
                        name="email"
                        className="register-form-item"
                        rules={[
                            {
                                type: 'email',
                                message: 'Email không hợp lệ!',
                            },
                            {
                                required: true,
                                message: 'Vui lòng nhập email!',
                            },
                        ]}
                    >
                        <Input
                            prefix={<MailOutlined className="register-form-icon" />}
                            placeholder="Email"
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        className="register-form-item"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập mật khẩu!',
                            },
                            {
                                min: 6,
                                message: 'Mật khẩu phải có ít nhất 6 ký tự!',
                            },
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined className="register-form-icon" />}
                            placeholder="Mật khẩu"
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item
                        name="phoneNo"
                        className="register-form-item"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập số điện thoại!',
                            },
                            {
                                pattern: /^[0-9]{10}$/,
                                message: 'Số điện thoại không hợp lệ!',
                            },
                        ]}
                    >
                        <Input
                            prefix={<PhoneOutlined className="register-form-icon" />}
                            placeholder="Số điện thoại"
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="register-form-button">
                            Đăng ký
                        </Button>
                    </Form.Item>

                    <div className="register-form-login">
                        Đã có tài khoản?
                        <Link to="/login">Đăng nhập ngay</Link>
                    </div>
                </Form>
            </div>
        </div>
    )
}

export default RegisterCustomer;
