import React from "react";
import {
  Table,
  Button,
  Typography,
  Tag,
  Tooltip,
  Row,
  Col,
  Space,
  Empty,
} from "antd";
import {
  PlusOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ReloadOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

export default function ShipmentTable({
  setCreateShipmentModel,
  allShipmentsdata = [],
  loading,
  onRefresh,
}) {
  const convertTime = (time) => {
    if (!time || Number(time) === 0) return "-";
    const newTime = new Date(time * 1000); // Assuming time is in seconds
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(newTime);
  };

  const shortenAddress = (addr) => {
    if (!addr) return "";
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const columns = [
    {
      title: "Sender",
      dataIndex: "sender",
      key: "sender",
      render: (text) => (
        <Tooltip title={text}>
          <Text code>{shortenAddress(text)}</Text>
        </Tooltip>
      ),
    },
    {
      title: "Receiver",
      dataIndex: "receiver",
      key: "receiver",
      render: (text) => (
        <Tooltip title={text}>
          <Text code>{shortenAddress(text)}</Text>
        </Tooltip>
      ),
    },
    {
      title: "Pickup Time",
      dataIndex: "pickupTime",
      key: "pickupTime",
      render: (value) => convertTime(value),
    },
    {
      title: "Delivery Time",
      dataIndex: "deliveryTime",
      key: "deliveryTime",
      render: (value) => convertTime(value),
      responsive: ["md"],
    },
    {
      title: "Distance",
      dataIndex: "distance",
      key: "distance",
      responsive: ["md"],
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (text) => <>{text} ETH</>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      filters: [
        { text: "Pending", value: 0 },
        { text: "In Transit", value: 1 },
        { text: "Delivered", value: 2 },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status) => {
        let color = "default";
        let text = "Pending";
        if (status === 1) {
          color = "processing";
          text = "In Transit";
        } else if (status === 2) {
          color = "success";
          text = "Delivered";
        }
        return <Tag color={color}>{text.toUpperCase()}</Tag>;
      },
    },
    {
      title: "Paid",
      dataIndex: "isPaid",
      key: "isPaid",
      filters: [
        { text: "Paid", value: true },
        { text: "Not Paid", value: false },
      ],
      onFilter: (value, record) => record.isPaid === value,
      render: (isPaid) => (
        <Tag
          icon={isPaid ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
          color={isPaid ? "success" : "error"}
        >
          {isPaid ? "PAID" : "NOT PAID"}
        </Tag>
      ),
    },
  ];

  return (
    <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-8">
      <Row justify="space-between" align="middle" className="mb-6 flex-wrap">
        <Col>
          <div className="mb-4 md:mb-0">
            <Title level={4} className="!mb-1">
              Shipment Tracking
            </Title>
            <Text type="secondary">
              Manage and track your shipments efficiently
            </Text>
          </div>
        </Col>
        <Col>
          <Space direction="vertical" align="end" className="text-right">
            <Text type="secondary" className="text-xs">
              Total Shipments: {allShipmentsdata.length}
            </Text>
            {allShipmentsdata.length > 0 && (
              <Space>
                <Button
                  icon={<ReloadOutlined />}
                  onClick={onRefresh}
                  loading={loading}
                  title="Refresh Shipments"
                >
                  Refresh
                </Button>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => setCreateShipmentModel(true)}
                  className="bg-primary hover:bg-primary-dark"
                >
                  Add Shipment
                </Button>
              </Space>
            )}
          </Space>
        </Col>
      </Row>

      <Table
        columns={columns}
        dataSource={allShipmentsdata}
        rowKey={(record) =>
          `${record.sender}-${record.receiver}-${record.pickupTime}`
        }
        pagination={{ pageSize: 5 }}
        scroll={{ x: "max-content" }}
        className="shadow-card"
        loading={loading}
        locale={{
          emptyText: (
            <Empty description={<span>No shipments found.</span>}>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setCreateShipmentModel(true)}
                className="bg-primary hover:bg-primary-dark"
              >
                Add Shipment
              </Button>
            </Empty>
          ),
        }}
      />
    </div>
  );
}
