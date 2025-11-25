import React from "react";
import { Table, Button, Typography, Tag, Space, Tooltip } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

export default function ShipmentTable({
  setCreateShipmentModel,
  allShipmentsdata = [],
}) {
  const convertTime = (time) => {
    if (!time || Number(time) === 0) return "-";
    const newTime = new Date(time);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(newTime);
  };

  const shortenAddress = (addr) => {
    if (!addr) return "";
    if (addr.length <= 14) return addr;
    return `${addr.slice(0, 8)}...${addr.slice(-6)}`;
  };

  const columns = [
    {
      title: "Sender",
      dataIndex: "sender",
      key: "sender",
      render: (text) =>
        text ? (
          <Tooltip title={text}>
            <Text code>{shortenAddress(text)}</Text>
          </Tooltip>
        ) : (
          "-"
        ),
    },
    {
      title: "Receiver",
      dataIndex: "receiver",
      key: "receiver",
      render: (text) =>
        text ? (
          <Tooltip title={text}>
            <Text code>{shortenAddress(text)}</Text>
          </Tooltip>
        ) : (
          "-"
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
    },
    {
      title: "Distance",
      dataIndex: "distance",
      key: "distance",
      render: (value) => (value != null ? `${value} km` : "-"),
      responsive: ["md"],
    },
    {
      title: "Price (ETH)",
      dataIndex: "price",
      key: "price",
      render: (value) => (value != null ? `${value} ETH` : "-"),
    },
    {
      title: "Paid",
      dataIndex: "isPaid",
      key: "isPaid",
      filters: [
        { text: "Completed", value: true },
        { text: "Not Complete", value: false },
      ],
      onFilter: (value, record) => record.isPaid === value,
      render: (isPaid) => (
        <Tag color={isPaid ? "green" : "red"}>
          {isPaid ? "Completed" : "Not Complete"}
        </Tag>
      ),
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
      onFilter: (value, record) => Number(record.status) === Number(value),
      render: (status) => {
        let color = "geekblue";
        let text = "PENDING";
        if (Number(status) === 1) {
          color = "orange";
          text = "IN TRANSIT";
        } else if (Number(status) === 2) {
          color = "green";
          text = "DELIVERED";
        }
        return <Tag color={color}>{text}</Tag>;
      },
    },
  ];

  return (
    <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-8">
      {/* Header bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
        <div>
          <Title level={3} style={{ marginBottom: 0 }}>
            Shipment Tracking
          </Title>
          <Text type="secondary">
            Manage and track your shipments efficiently
          </Text>
        </div>

        <Space direction="vertical" align="end" size={4}>
          <Text type="secondary" style={{ fontSize: 12 }}>
            Total Shipments
          </Text>
          <Space>
            <Text strong>{allShipmentsdata.length}</Text>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setCreateShipmentModel(true)}
              size="middle"
              style={{ backgroundColor: "black", borderColor: "black" }}
            >
              Add Shipment
            </Button>
          </Space>
        </Space>
      </div>

      {/* Table */}
      <Table
        columns={columns}
        dataSource={allShipmentsdata}
        rowKey={(record, index) =>
          record.id ?? `${record.sender}-${record.receiver}-${index}`
        }
        pagination={{ pageSize: 5, showSizeChanger: false }}
        className="shadow-sm rounded-lg overflow-hidden bg-white"
        scroll={{ x: "max-content" }}
      />
    </div>
  );
}
