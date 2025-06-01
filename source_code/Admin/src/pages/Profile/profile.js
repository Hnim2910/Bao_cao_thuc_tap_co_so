import {
    FormOutlined,
    HomeOutlined,
    PhoneOutlined,
    MailOutlined,
    UserOutlined
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
    notification
} from 'antd';
import React, { useEffect, useState } from 'react';
import ReactWeather, { useOpenWeather } from 'react-open-weather';
import uploadFileApi from '../../apis/uploadFileApi';
import userApi from "../../apis/userApi";
import "./profile.css";

const Profile = () => {
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState([]);
    const [isVisibleModal, setVisibleModal] = useState(false);
    const [file, setUploadFile] = useState();
    const [image_qr, setImageQR] = useState();

    const { data, isLoading, errorMessage } = useOpenWeather({
        key: '03b81b9c18944e6495d890b189357388',
        lat: '16.060094749570567',
        lon: '108.2097695823264',
        lang: 'en',
        unit: 'metric',
    });

    let isMounted = true;

    const fetchData = async () => {
        try {
            const response = await userApi.getProfile();
            if (isMounted) {
                setUserData(response.user);
                setLoading(false);
            }
        } catch (error) {
            console.log('Failed to fetch profile user:' + error);
        }
    };

    useEffect(() => {
        fetchData();
        return () => {
            isMounted = false;
        };
    }, []);

    const handleFormSubmit = async (values) => {
        try {
            const formatData = {
                "email": values.email,
                "phone": values.phone,
                "username": values.username,
                "image": file,
                "image_qr": image_qr || ""
            };
            
            const response = await userApi.updateProfile(formatData, userData.id);
            if (!response) {
                notification.error({
                    message: 'Thông báo',
                    description: 'Cập nhật tài khoản thất bại',
                });
            } else {
                notification.success({
                    message: 'Thông báo',
                    description: 'Cập nhật tài khoản thành công',
                });
                setVisibleModal(false);
                setUploadFile();
                fetchData();
            }
        } catch (error) {
            notification.error({
                message: 'Thông báo',
                description: 'Đã có lỗi xảy ra',
            });
        }
    };

    const handleChangeImage = async (e) => {
        setLoading(true);
        try {
            const response = await uploadFileApi.uploadFile(e);
            if (response) {
                setUploadFile(response);
            }
        } catch (error) {
            notification.error({
                message: 'Thông báo',
                description: 'Tải ảnh lên thất bại',
            });
        }
        setLoading(false);
    }

    const handleChangeImageQR = async (e) => {
        setLoading(true);
        try {
            const response = await uploadFileApi.uploadFile(e);
            if (response) {
                setImageQR(response);
            }
        } catch (error) {
            notification.error({
                message: 'Thông báo',
                description: 'Tải ảnh QR lên thất bại',
            });
        }
        setLoading(false);
    }

    return (
        <div className="profile-container">
            <Spin spinning={loading}>
                <div className="profile-breadcrumb">
                    <Breadcrumb>
                        <Breadcrumb.Item href="">
                            <HomeOutlined />
                        </Breadcrumb.Item>
                        <Breadcrumb.Item href="">
                            <FormOutlined />
                            <span>Trang cá nhân</span>
                        </Breadcrumb.Item>
                    </Breadcrumb>
                </div>

                <Row gutter={24}>
                    <Col xs={24} sm={24} md={16} lg={16} xl={16}>
                        <Card className="profile-card">
                            <Row justify="center" align="middle">
                                <Col span={24} style={{ textAlign: 'center' }}>
                                    <img
                                        src={userData?.image || 'https://via.placeholder.com/150'}
                                        alt="Profile"
                                        className="profile-avatar"
                                    />
                                    <h2 className="profile-name">{userData?.username}</h2>
                                    <div className="profile-info">
                                        <p><MailOutlined /> {userData?.email}</p>
                                        <p><PhoneOutlined /> {userData?.phone}</p>
                                        <p><UserOutlined /> {userData?.birthday}</p>
                                    </div>
                                    <Divider className="profile-divider" />
                                    <Button 
                                        type="primary" 
                                        className="profile-update-btn"
                                        onClick={() => setVisibleModal(true)}
                                    >
                                        Cập nhật thông tin
                                    </Button>
                                </Col>
                            </Row>
                        </Card>
                    </Col>

                    <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                        <div className="profile-weather">
                            <ReactWeather
                                isLoading={isLoading}
                                errorMessage={errorMessage}
                                data={data}
                                lang="en"
                                locationLabel="TP. Quy Nhơn"
                                unitsLabels={{ temperature: 'C', windSpeed: 'Km/h' }}
                                showForecast
                            />
                        </div>
                    </Col>
                </Row>

                <Modal
                    title="Cập nhật thông tin cá nhân"
                    visible={isVisibleModal}
                    onCancel={() => setVisibleModal(false)}
                    footer={null}
                    className="profile-modal"
                >
                    <Form
                        initialValues={{
                            username: userData?.username,
                            email: userData?.email,
                            phone: userData?.phone,
                        }}
                        onFinish={handleFormSubmit}
                        layout="vertical"
                    >
                        <Spin spinning={loading}>
                            <Form.Item
                                label="Họ và tên"
                                name="username"
                                className="profile-form-item"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập họ tên!' },
                                    { min: 2, max: 30, message: 'Họ tên phải từ 2 đến 30 ký tự!' },
                                ]}
                            >
                                <Input prefix={<UserOutlined />} />
                            </Form.Item>

                            <Form.Item
                                label="Email"
                                name="email"
                                className="profile-form-item"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập email!' },
                                    { type: 'email', message: 'Email không hợp lệ!' },
                                ]}
                            >
                                <Input prefix={<MailOutlined />} />
                            </Form.Item>

                            <Form.Item
                                label="Số điện thoại"
                                name="phone"
                                className="profile-form-item"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập số điện thoại!' },
                                    { pattern: /^[0-9]{10}$/, message: "Số điện thoại phải có 10 chữ số" },
                                ]}
                            >
                                <Input prefix={<PhoneOutlined />} />
                            </Form.Item>

                            <Form.Item label="Ảnh đại diện" className="profile-upload">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleChangeImage}
                                    id="avatar"
                                />
                            </Form.Item>

                            <Form.Item label="Ảnh mã QR" className="profile-upload">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleChangeImageQR}
                                    id="avatar2"
                                />
                            </Form.Item>

                            <Form.Item>
                                <Button type="primary" htmlType="submit" className="profile-update-btn" block>
                                    Cập nhật
                                </Button>
                            </Form.Item>
                        </Spin>
                    </Form>
                </Modal>
            </Spin>
        </div>
    );
}

export default Profile;