import {
    FormOutlined,
    HomeOutlined,
    UserOutlined,
    MailOutlined,
    PhoneOutlined,
    CalendarOutlined,
    EditOutlined
} from '@ant-design/icons';
import {
    Breadcrumb,
    Button,
    Card,
    Col,
    Divider,
    Form,
    Input,
    Modal,
    Row,
    Spin,
    Avatar,
    notification
} from 'antd';
import React, { useEffect, useState } from 'react';
import ReactWeather, { useOpenWeather } from 'react-open-weather';
import uploadFileApi from '../../apis/uploadFileApi';
import userApi from "../../apis/userApi";
import "./profile.css";

const Profile = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [image, setImage] = useState("");

    const { data, isLoading: weatherLoading } = useOpenWeather({
        key: 'bb8c6ed524e7399f25ddb1b5e994bdf7',
        lat: '10.762622',
        lon: '106.660172',
        lang: 'vi',
        unit: 'metric',
    });

    const showModal = () => {
        form.setFieldsValue({
            username: userData?.username,
            email: userData?.email,
            phone: userData?.phone,
        });
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleList = () => {
        (async () => {
            try {
                const response = await userApi.getProfile();
                console.log(response);
                setUserData(response.user);
                setLoading(false);
            } catch (error) {
                console.log('Failed to fetch profile user:' + error);
            }
        })();
    }

    useEffect(() => {
        (async () => {
            handleList();
        })();
        window.scrollTo(0, 0);
    }, [])

    const onFinish = async (values) => {
        try {
            const formatData = {
                "email": values.email,
                "phone": values.phone,
                "username": values.username,
                "image": image,
            };
            console.log(userData);
            await userApi.updateProfile(formatData, userData.id)
                .then(response => {
                    console.log(response);
                    if (response === '' || response === undefined) {
                        notification.error({
                            message: 'Thông báo',
                            description: 'Cập nhật tài khoản thất bại',
                        });
                    } else {
                        notification.success({
                            message: 'Thông báo',
                            description: 'Cập nhật tài khoản thành công',
                        });
                        setIsModalVisible(false)
                        setImage("");
                    }
                });
            handleList();
        } catch (error) {
            throw error;
        }
    };

    const handleImageChange = async (e) => {
        setLoading(true);
        const response = await uploadFileApi.uploadFile(e);
        if (response) {
            setImage(response);
        }
        setLoading(false);
    }

    return (
        <div className="profile-page">
            <div className="profile-container">
                <div className="profile-header">
                    <Breadcrumb className="profile-breadcrumb">
                        <Breadcrumb.Item>
                            <HomeOutlined /> Trang chủ
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>Hồ sơ cá nhân</Breadcrumb.Item>
                    </Breadcrumb>
                </div>

                <Row gutter={[24, 24]}>
                    <Col xs={24} md={16}>
                        <Card className="profile-card">
                            {loading ? (
                                <div style={{ textAlign: 'center', padding: '40px' }}>
                                    <Spin size="large" />
                                </div>
                            ) : (
                                <div className="profile-info">
                                    <div style={{ textAlign: 'center' }}>
                                        <Avatar
                                            src={image || userData?.image}
                                            alt={userData?.username}
                                            className="profile-avatar"
                                            size={120}
                                        />
                                        <h1 className="profile-name">{userData?.username}</h1>
                                        <p className="profile-role">Thành viên HealthBooker</p>
                                    </div>

                                    <div className="profile-details">
                                        <div className="profile-detail-item">
                                            <UserOutlined className="profile-detail-icon" />
                                            <span className="profile-detail-label">Họ và tên</span>
                                            <span className="profile-detail-value">{userData?.username}</span>
                                        </div>

                                        <div className="profile-detail-item">
                                            <MailOutlined className="profile-detail-icon" />
                                            <span className="profile-detail-label">Email</span>
                                            <span className="profile-detail-value">{userData?.email}</span>
                                        </div>

                                        <div className="profile-detail-item">
                                            <PhoneOutlined className="profile-detail-icon" />
                                            <span className="profile-detail-label">Số điện thoại</span>
                                            <span className="profile-detail-value">{userData?.phone}</span>
                                        </div>

                                        <div className="profile-detail-item">
                                            <CalendarOutlined className="profile-detail-icon" />
                                            <span className="profile-detail-label">Ngày tham gia</span>
                                            <span className="profile-detail-value">
                                                {new Date(userData?.createdAt).toLocaleDateString('vi-VN')}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="profile-actions">
                                        <Button
                                            onClick={showModal}
                                            type="primary"
                                            className="profile-edit-button"
                                            icon={<EditOutlined />}
                                        >
                                            Chỉnh sửa thông tin
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </Card>
                    </Col>

                </Row>

                <Modal
                    title="Chỉnh sửa thông tin"
                    visible={isModalVisible}
                    onCancel={handleCancel}
                    footer={null}
                    className="profile-modal"
                    destroyOnClose
                >
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={onFinish}
                    >
                        <Form.Item
                            label="Họ và tên"
                            name="username"
                            rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
                        >
                            <Input prefix={<UserOutlined />} placeholder="Nhập họ và tên" />
                        </Form.Item>

                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[
                                { required: true, message: 'Vui lòng nhập email!' },
                                { type: 'email', message: 'Email không hợp lệ!' }
                            ]}
                        >
                            <Input prefix={<MailOutlined />} placeholder="Nhập email" />
                        </Form.Item>

                        <Form.Item
                            label="Số điện thoại"
                            name="phone"
                            rules={[
                                { required: true, message: 'Vui lòng nhập số điện thoại!' },
                                { pattern: /^[0-9]{10}$/, message: 'Số điện thoại không hợp lệ!' }
                            ]}
                        >
                            <Input prefix={<PhoneOutlined />} placeholder="Nhập số điện thoại" />
                        </Form.Item>

                        <Form.Item label="Ảnh đại diện">
                            <input type="file" onChange={handleImageChange} accept="image/*" />
                        </Form.Item>

                        <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
                            <Button onClick={handleCancel} style={{ marginRight: 12 }}>
                                Hủy
                            </Button>
                            <Button type="primary" htmlType="submit">
                                Lưu thay đổi
                            </Button>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        </div>
    );
};

export default Profile;