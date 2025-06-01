import {
  Breadcrumb,
  Button,
  Card,
  Spin,
  Empty,
  notification
} from "antd";
import {
  HomeOutlined,
  UserOutlined,
  EnvironmentOutlined,
  MedicineBoxOutlined
} from '@ant-design/icons';
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import areaManagementApi from "../../../apis/areaManagementApi";
import courtsManagementApi from "../../../apis/courtsManagementApi";
import "./productList.css";

const ProductList = () => {
  const [doctors, setDoctors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const history = useHistory();

  const handleDoctorClick = (doctorId) => {
    history.push("/product-detail/" + doctorId);
  };

  const handleCategoryClick = (categoryId) => {
    history.push(`/product-list/${categoryId}`);
  };

  const handleViewAllDoctors = async () => {
    setLoading(true);
    try {
      const response = await courtsManagementApi.getAllCourts();
      const approvedDoctors = response.filter(doctor => doctor.approval_status === 'approved');
      setDoctors(approvedDoctors);
    } catch (error) {
      notification.error({
        message: 'Lỗi',
        description: 'Không thể tải danh sách bác sĩ',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch categories
        const categoriesResponse = await areaManagementApi.getAllAreas();
        setCategories(categoriesResponse);

        // Fetch doctors by category if id exists
        if (id) {
          const doctorsResponse = await courtsManagementApi.getCourtByCategory(id);
          const approvedDoctors = doctorsResponse.filter(doctor => 
            doctor.approval_status !== "pending"
          );
          setDoctors(approvedDoctors);
        } else {
          // Fetch all doctors if no category selected
          const allDoctorsResponse = await courtsManagementApi.getAllCourts();
          const approvedDoctors = allDoctorsResponse.filter(doctor => 
            doctor.approval_status === "approved"
          );
          setDoctors(approvedDoctors);
        }
      } catch (error) {
        notification.error({
          message: 'Lỗi',
          description: 'Không thể tải dữ liệu',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    window.scrollTo(0, 0);
  }, [id]);

  return (
    <Spin spinning={loading}>
      <div className="doctor-list-container">
        <div className="doctor-list-breadcrumb">
          <Breadcrumb>
            <Breadcrumb.Item href="/home">
              <HomeOutlined /> Trang chủ
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <UserOutlined /> Danh sách bác sĩ
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>

        <Card style={{ padding: '20px' }}>
          <div className="doctor-categories">
            {categories.map((category) => (
              <div
                key={category.id}
                className="doctor-category-item"
                onClick={() => handleCategoryClick(category.id)}
              >
                <h3 className="doctor-category-name">{category.name}</h3>
              </div>
            ))}
          </div>

          <div className="doctor-list-header">
            <h2 className="doctor-list-title">Danh sách bác sĩ</h2>
            <Button
              className="doctor-list-all-btn"
              onClick={handleViewAllDoctors}
            >
              Xem tất cả bác sĩ
            </Button>
          </div>

          {doctors.length > 0 ? (
            <div className="doctor-grid">
              {doctors.map((doctor) => (
                <div
                  key={doctor.id}
                  className="doctor-card"
                  onClick={() => handleDoctorClick(doctor.id)}
                >
                  <img
                    className="doctor-card-image"
                    src={doctor.image || require('../../../assets/image/NoImageAvailable.jpg')}
                    alt={doctor.name}
                  />
                  <div className="doctor-card-content">
                    <h3 className="doctor-card-name">{doctor.name}</h3>
                    <p className="doctor-card-info">
                      <EnvironmentOutlined /> Khu vực: <span>{doctor.area}</span>
                    </p>
                    <p className="doctor-card-info">
                      <MedicineBoxOutlined /> Chuyên khoa: <span>{doctor.field_type}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Empty
              description="Không tìm thấy bác sĩ nào"
              style={{ margin: '40px 0' }}
            />
          )}
        </Card>
      </div>
    </Spin>
  );
};

export default ProductList;
