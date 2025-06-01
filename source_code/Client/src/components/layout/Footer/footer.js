import React from 'react';
import { Layout } from 'antd';
import { Col, Row } from "antd";
import { SocialIcon } from 'react-social-icons';
import { PhoneOutlined, MailOutlined, EnvironmentOutlined, ClockCircleOutlined } from '@ant-design/icons';
import "./footer.css";

const { Footer } = Layout;

function _Footer() {
    return (
        <Footer className="footer-container">
            <div className="footer-wave"></div>
            <Row className="footer-desktop">
                <Col lg={6} md={12} sm={24} xs={24} className="footer-section">
                    <img src="https://i.namu.wiki/i/a3GkhQuvwxycyyNIHB1NyYbwBoGS_F97T7a5UpDWQpnn7RpltuCq7rTg9ydpB2-Irum_UE05LSyhWR9tsGTEwA.svg" alt="HealthBooker Logo" className="footer-logo" />
                    <p className="footer-description">
                        Trauma Team - Nền tảng đặt lịch khám bệnh trực tuyến hàng đầu Việt Nam, kết nối bệnh nhân với mạng lưới bác sĩ và cơ sở y tế uy tín.
                    </p>
                    <div className="footer-social">
                        <SocialIcon url="https://www.youtube.com/@minhbimbim" target="_blank" className="footer-social-icon" style={{ height: 35, width: 35 }} />
                        <SocialIcon url="https://www.facebook.com/tran.minh.71300" target="_blank" className="footer-social-icon" style={{ height: 35, width: 35 }} />
                        <SocialIcon url="https://www.instagram.com/vaahati" target="_blank" className="footer-social-icon" style={{ height: 35, width: 35 }} />
                        <SocialIcon url="https://www.tiktok.com/@prisc0minh" target="_blank" className="footer-social-icon" style={{ height: 35, width: 35 }} />
                    </div>
                </Col>
                
                <Col lg={6} md={12} sm={24} xs={24} className="footer-section">
                    <h3 className="footer-title">Dịch vụ</h3>
                    <a href="#" className="footer-link">Đặt lịch khám</a>
                    <a href="#" className="footer-link">Tư vấn sức khỏe</a>
                    <a href="#" className="footer-link">Hồ sơ bệnh án</a>
                    <a href="#" className="footer-link">Thanh toán trực tuyến</a>
                    <a href="#" className="footer-link">Tra cứu kết quả</a>
                </Col>

                <Col lg={6} md={12} sm={24} xs={24} className="footer-section">
                    <h3 className="footer-title">Thông tin</h3>
                    <a href="#" className="footer-link">Về chúng tôi</a>
                    <a href="#" className="footer-link">Quy chế hoạt động</a>
                    <a href="#" className="footer-link">Chính sách bảo mật</a>
                    <a href="#" className="footer-link">Điều khoản sử dụng</a>
                    <a href="#" className="footer-link">Câu hỏi thường gặp</a>
                </Col>

                <Col lg={6} md={12} sm={24} xs={24} className="footer-section">
                    <h3 className="footer-title">Liên hệ</h3>
                    <div className="footer-contact-info">
                        <div className="footer-contact-item">
                            <EnvironmentOutlined className="footer-contact-icon" />
                            29 ngách 291/44 Khương Trung, Khương Trung, Thanh Xuân, Hà Nội
                        </div>
                        <div className="footer-contact-item">
                            <PhoneOutlined className="footer-contact-icon" />
                            Hotline: (+84) 913366937
                        </div>
                        <div className="footer-contact-item">
                            <MailOutlined className="footer-contact-icon" />
                            support@traumateam.vn
                        </div>
                        <div className="footer-contact-item">
                            <ClockCircleOutlined className="footer-contact-icon" />
                            24/7 - Tất cả các ngày trong tuần
                        </div>
                    </div>
                </Col>
            </Row>

            <div className="footer-bottom">
                <p className="footer-copyright">
                    {/* © 2025 HealthBooker. Tất cả quyền được bảo lưu. */}
                </p>
            </div>
        </Footer>
    );
}

export default _Footer;