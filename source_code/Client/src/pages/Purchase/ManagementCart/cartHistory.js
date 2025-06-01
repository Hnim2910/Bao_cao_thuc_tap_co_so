import {
    Breadcrumb,
    Button,
    Card,
    Modal,
    Spin,
    Table,
    Tag,
    Empty,
    notification
} from "antd";
import {
    HomeOutlined,
    HistoryOutlined,
    PrinterOutlined,
    CloseCircleOutlined,
    ExclamationCircleOutlined
} from "@ant-design/icons";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import axiosClient from "../../../apis/axiosClient";
import bookingApi from "../../../apis/bookingApi";
import html2pdf from 'html2pdf.js';

import "./cartHistory.css";

const CartHistory = () => {
    const [orderList, setOrderList] = useState([]);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();
    const history = useHistory();

    useEffect(() => {
        handleList();
        window.scrollTo(0, 0);
    }, []);


    const handleCancelOrder = (order) => {
        console.log(order);
        Modal.confirm({
            title: 'Xác nhận hủy bác sỹ',
            content: 'Bạn có chắc muốn hủy bác sỹ này?',
            okText: 'Xác nhận',
            cancelText: 'Hủy',
            onOk() {
                handleUpdateOrder(order._id);
            },
        });
    };


    const handleUpdateOrder = async (id) => {
        setLoading(true);
        try {
            const categoryList = {
                "description": "Khách hàng hủy bác sỹ!",
                "status": "rejected"
            }
            await axiosClient.put("/order/" + id, categoryList).then(response => {
                if (response === undefined) {
                    notification["error"]({
                        message: `Thông báo`,
                        description:
                            'Cập nhật thất bại',
                    });
                }
                else {
                    notification["success"]({
                        message: `Thông báo`,
                        description:
                            'Cập nhật thành công',
                    });
                }
            })

            handleList();
            setLoading(false);

        } catch (error) {
            throw error;
        }
    }

    const handlePrintInvoice = (order) => {
        const formattedDate = moment(order.booking_date).format('DD/MM/YYYY HH:mm');

        const htmlContent = `
            <html>
                <head>
                    <title>Hóa đơn</title>
                    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
                    <style>
                        .invoice {
                            width: 100%;
                            margin: 0 auto;
                            padding: 1rem;
                            background-color: #fff;
                            border: 1px solid #ccc;
                            border-radius: 0.5rem;
                            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                        }
    
                        .invoice-header {
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            margin-bottom: 1rem;
                        }
    
                        .invoice-header h1 {
                            font-size: 2rem;
                            font-weight: bold;
                            color: #333;
                        }
    
                        .invoice-details {
                            margin-bottom: 1rem;
                        }
    
                        .invoice-details p {
                            margin: 0.5rem 0;
                        }
    
                        .invoice-total {
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            font-weight: bold;
                        }
                    </style>
                </head>
                <body>
                    <div class="invoice">
                        <div class="invoice-header">
                            <h1>Hóa đơn bán hàng</h1>
                            <p>Ngày: ${new Date().toLocaleDateString()}</p>
                        </div>
                        <div class="invoice-details">
                            <p><span class="font-semibold">Tên sân:</span> ${order.name}</p>
                            <p><span class="font-semibold">Ngày đặt:</span> ${formattedDate}</p>
                            <p><span class="font-semibold">Giờ bắt đầu:</span> ${order.start_time}</p>
                            <p><span class="font-semibold">Giờ kết thúc:</span> ${order.end_time}</p>
                        </div>
                        <div class="invoice-total">
                            <span>Tổng tiền:</span>
                            <span>${order.total_amount}</span>
                        </div>
                    </div>
                </body>
            </html>
        `;
    
        html2pdf().from(htmlContent).save(`invoice_${order.id}.pdf`);
    };

    const columns = [
        {
            title: "Tên bác sĩ",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Ngày đặt",
            dataIndex: "booking_date",
            key: "booking_date",
            render: (date) => (
                <span>{moment(date).format("DD/MM/YYYY HH:mm")}</span>
            ),
        },
        {
            title: "Giờ bắt đầu",
            dataIndex: "start_time",
            key: "start_time",
        },
        {
            title: "Giờ kết thúc",
            dataIndex: "end_time",
            key: "end_time",
        },
        {
            title: "Tổng tiền",
            dataIndex: "total_amount",
            key: "total_amount",
            render: (amount) => (
                <span style={{ color: '#1976d2', fontWeight: 500 }}>
                    {Number(amount)?.toLocaleString("vi", {
                        style: "currency",
                        currency: "VND",
                    })}
                </span>
            ),
        },
        {
            title: 'Trạng thái',
            key: 'status',
            dataIndex: 'status',
            render: (status) => {
                let className = '';
                let text = '';
                
                switch(status) {
                    case 'rejected':
                        className = 'status-rejected';
                        text = 'Đã hủy';
                        break;
                    case 'approved':
                        className = 'status-approved';
                        text = 'Đang xem xét';
                        break;
                    case 'final':
                        className = 'status-final';
                        text = 'Đã xác nhận';
                        break;
                    default:
                        className = 'status-pending';
                        text = 'Chờ xác nhận';
                }
                
                return <span className={`status-tag ${className}`}>{text}</span>;
            },
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (_, record) => (
                <div className="cart-history-action">
                    {record.status === 'final' && (
                        <Button
                            className="cart-history-button print"
                            icon={<PrinterOutlined />}
                            onClick={() => handlePrintInvoice(record)}
                        >
                            In hóa đơn
                        </Button>
                    )}
                    {record.status !== 'rejected' && record.status !== 'final' && (
                        <Button
                            className="cart-history-button cancel"
                            icon={<CloseCircleOutlined />}
                            onClick={() => handleCancelOrder(record)}
                        >
                            Hủy lịch
                        </Button>
                    )}
                </div>
            ),
        },
        //             disabled={record.status !== 'pending'}
        //         >
        //             Hủy bác sỹ
        //         </Button>
        //     ),
        // },
    ];

    const handleList = () => {
        (async () => {
            try {
                const local = localStorage.getItem("user");
                const user = JSON.parse(local);
                await bookingApi.getBookingHistory(user.id).then((item) => {
                    console.log(item);
                    setOrderList(item);
                });
                setLoading(false);
            } catch (error) {
                console.log("Failed to fetch event detail:" + error);
            }
        })();
    }

    useEffect(() => {
        handleList();
        window.scrollTo(0, 0);
    }, []);

    // Thêm vào component của bạn
    const handleProductClick = (id) => {
        history.push("/product-detail/" + id);
    };

    return (
        <div className="cart-history-page">
            <div className="cart-history-container">
                <div className="cart-history-header">
                    <Breadcrumb className="cart-history-breadcrumb">
                        <Breadcrumb.Item>
                            <HomeOutlined /> Trang chủ
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>
                            <HistoryOutlined /> Lịch sử đặt lịch
                        </Breadcrumb.Item>
                    </Breadcrumb>
                    <h1 className="cart-history-title">Lịch sử đặt lịch của bạn</h1>
                </div>

                <Card className="cart-history-card">
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '40px' }}>
                            <Spin size="large" />
                        </div>
                    ) : orderList.length === 0 ? (
                        <Empty
                            className="cart-history-empty"
                            description={
                                <span className="cart-history-empty-text">
                                    Bạn chưa có lịch đặt nào
                                </span>
                            }
                        />
                    ) : (
                        <Table
                            className="cart-history-table"
                            columns={columns}
                            dataSource={orderList}
                            rowKey="_id"
                            pagination={{
                                pageSize: 10,
                                position: ['bottomCenter'],
                                showSizeChanger: false
                            }}
                        />
                    )}
                </Card>
            </div>
        </div>
    );
};

export default CartHistory;
