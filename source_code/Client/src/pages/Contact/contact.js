import React, { useState } from "react";
import { Form, Input, Button, message, Card, Typography, Breadcrumb } from 'antd';
import { HomeOutlined, PhoneOutlined, MailOutlined, EnvironmentOutlined, MessageOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import axiosClient from "../../apis/axiosClient";
import './contact.css';

const Contact = () => {
  const [form] = Form.useForm();

  const handleSubmit = async (values) => {
    try {
      await axiosClient.post("/notifications/createNotificationByEmail", {
        full_name: values.full_name,
        emails: ["thenamdivine@gmail.com"],
        title: values.subject + " Email người gửi: "+ values.email + " Họ tên: " + values.full_name,
        content: values.message
      });
      
      message.success('Gửi tin nhắn thành công!');
      form.resetFields();
    } catch (error) {
      message.error('Có lỗi xảy ra. Vui lòng thử lại sau.');
    }
  };

  return (
    <div className="contact-page">
      <div className="contact-container">
        <div className="contact-header">
          <Breadcrumb className="contact-breadcrumb">
            <Breadcrumb.Item>
              <Link to="/home">
                <HomeOutlined /> Trang chủ
              </Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <PhoneOutlined /> Liên hệ
            </Breadcrumb.Item>
          </Breadcrumb>

          <Typography.Title level={2} className="contact-title">
            Liên hệ với chúng tôi
          </Typography.Title>
        </div>

        <div className="contact-content">
          <Card className="contact-info-card">
            <div className="contact-info-grid">
              <div className="contact-info-item">
                <PhoneOutlined className="contact-icon" />
                <div className="contact-info-text">
                  <Typography.Title level={4}>Điện thoại</Typography.Title>
                  <Typography.Text>+913366937</Typography.Text>
                </div>
              </div>
              <div className="contact-info-item">
                <MailOutlined className="contact-icon" />
                <div className="contact-info-text">
                  <Typography.Title level={4}>Email</Typography.Title>
                  <Typography.Text>info@doctorgo.com</Typography.Text>
                </div>
              </div>
              <div className="contact-info-item">
                <EnvironmentOutlined className="contact-icon" />
                <div className="contact-info-text">
                  <Typography.Title level={4}>Địa chỉ</Typography.Title>
                  <Typography.Text>
                    29 ngách 291/44 Khương Trung, Khương Đình, Thanh Xuân, Hà Nội
                  </Typography.Text>
                </div>
              </div>
            </div>
          </Card>

          <div className="contact-main">
            <Card className="contact-form-card" style={{ padding: '20px' }}>
              <Typography.Title level={3} className="form-title">
                <MessageOutlined /> Gửi tin nhắn cho chúng tôi
              </Typography.Title>
              <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                className="contact-form"
              >
                <div className="form-row">
                  <Form.Item
                    name="full_name"
                    label="Họ tên"
                    rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
                  >
                    <Input placeholder="Nhập họ tên của bạn" />
                  </Form.Item>

                  <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                      { required: true, message: 'Vui lòng nhập email' },
                      { type: 'email', message: 'Email không hợp lệ' }
                    ]}
                  >
                    <Input placeholder="Nhập địa chỉ email" />
                  </Form.Item>
                </div>

                <Form.Item
                  name="subject"
                  label="Chủ đề"
                  rules={[{ required: true, message: 'Vui lòng nhập chủ đề' }]}
                >
                  <Input placeholder="Nhập chủ đề" />
                </Form.Item>

                <Form.Item
                  name="message"
                  label="Nội dung"
                  rules={[{ required: true, message: 'Vui lòng nhập nội dung' }]}
                >
                  <Input.TextArea
                    rows={4}
                    placeholder="Nhập nội dung tin nhắn"
                  />
                </Form.Item>

                <Form.Item>
                  <Button type="primary" htmlType="submit" className="submit-button">
                    Gửi tin nhắn
                  </Button>
                </Form.Item>
              </Form>
            </Card>

            <Card className="contact-map-card">
              <div className="map-container">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.9753702244807!2d105.8159838758407!3d20.99362438898328!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ac8e0c56815b%3A0x73505f91edd6a076!2zMjkxLzQ0IFAuS2jGsMahbmcgVHJ1bmcsIEtoxrDGoW5nIFRydW5nLCBUaGFuaCBYdcOibiwgSMOgIE7hu5lpLCBWaeG7h3QgTmFt!5e0!3m2!1svi!2s!4v1748744513612!5m2!1svi!2s"
                  width="100%"
                  height="400"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
