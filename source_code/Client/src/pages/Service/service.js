import { Breadcrumb, Card, Input, List, Spin, Empty } from "antd";
import { HomeOutlined, MedicineBoxOutlined, SearchOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import "./service.css";
import productAPI from "../../apis/productApi";

const { Search } = Input;

const Service = () => {
  const [news, setNews] = useState([]);
  let history = useHistory();

  useEffect(() => {
    (async () => {
      try {
        await productAPI.getAllProducts().then((item) => {
          setNews(item);
        });
      } catch (error) {
        console.log("Failed to fetch event detail:" + error);
      }
    })();
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="service-page">
      <div className="service-container">
        <div className="service-header">
          <Breadcrumb className="service-breadcrumb">
            <Breadcrumb.Item>
              <Link to="/home">
                <HomeOutlined /> Trang chủ
              </Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <MedicineBoxOutlined /> Dịch vụ
            </Breadcrumb.Item>
          </Breadcrumb>
          <h1 className="service-title">Dịch vụ của chúng tôi</h1>
          
          <div className="service-search">
            <Search
              placeholder="Tìm kiếm dịch vụ..."
              prefix={<SearchOutlined className="search-icon" />}
              className="search-input"
            />
          </div>
        </div>

        <div className="service-content">
          <Spin spinning={false}>
            {news.length === 0 ? (
              <Empty
                className="service-empty"
                description={
                  <span className="service-empty-text">
                    Không tìm thấy dịch vụ nào
                  </span>
                }
              />
            ) : (
              <List
                className="service-list"
                grid={{
                  gutter: [24, 24],
                  xs: 1,
                  sm: 2,
                  md: 3,
                  lg: 3,
                  xl: 4,
                  xxl: 4,
                }}
                dataSource={news}
                renderItem={(item) => (
                  <List.Item>
                    <Link to={`/service/${item.id}`} className="service-card-link">
                      <Card
                        hoverable
                        className="service-card"
                        cover={
                          <div className="service-card-image">
                            <img
                              src={item.image}
                              alt={item.name}
                            />
                          </div>
                        }
                      >
                        <Card.Meta
                          title={item.name}
                          description={item.description || 'Xem chi tiết'}
                        />
                      </Card>
                    </Link>
                  </List.Item>
                )}
              />
            )}
          </Spin>
        </div>
      </div>
    </div>
  );
};

export default Service;
