import { Breadcrumb, Card, Input, List, Spin, Empty, Typography } from "antd";
import { HomeOutlined, NotificationOutlined, SearchOutlined, CalendarOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import moment from 'moment';
import "./news.css";
import newsApi from "../../apis/newsApi";

const { Search } = Input;

const News = () => {
  const [news, setNews] = useState([]);
  let history = useHistory();

  useEffect(() => {
    (async () => {
      try {
        await newsApi.getListNews().then((item) => {
          setNews(item);
        });
      } catch (error) {
        console.log("Failed to fetch event detail:" + error);
      }
    })();
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="news-page">
      <div className="news-container">
        <div className="news-header">
          <Breadcrumb className="news-breadcrumb">
            <Breadcrumb.Item>
              <Link to="/home">
                <HomeOutlined /> Trang chủ
              </Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <NotificationOutlined /> Tin tức & Sự kiện
            </Breadcrumb.Item>
          </Breadcrumb>
          <h1 className="news-title">Tin tức & Sự kiện</h1>
          
          <div className="news-search">
            <Search
              placeholder="Tìm kiếm tin tức..."
              prefix={<SearchOutlined className="search-icon" />}
              className="search-input"
            />
          </div>
        </div>

        <div className="news-content">
          <Spin spinning={false}>
            {news.length === 0 ? (
              <Empty
                className="news-empty"
                description={
                  <span className="news-empty-text">
                    Không tìm thấy tin tức nào
                  </span>
                }
              />
            ) : (
              <List
                className="news-list"
                grid={{
                  gutter: [24, 24],
                  xs: 1,
                  sm: 2,
                  md: 2,
                  lg: 3,
                  xl: 3,
                  xxl: 4,
                }}
                dataSource={news}
                renderItem={(item) => (
                  <List.Item>
                    <Link to={`/news/${item.id}`} className="news-card-link">
                      <Card
                        hoverable
                        className="news-card"
                        cover={
                          <div className="news-card-image">
                            <img
                              src={item.image}
                              alt={item.name}
                            />
                            {item.category && (
                              <div className="news-card-category">
                                {item.category}
                              </div>
                            )}
                          </div>
                        }
                      >
                        <div className="news-card-date">
                          <CalendarOutlined /> {moment(item.createdAt).format('DD/MM/YYYY')}
                        </div>
                        <Typography.Title level={4} className="news-card-title">
                          {item.name}
                        </Typography.Title>
                       
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

export default News;
