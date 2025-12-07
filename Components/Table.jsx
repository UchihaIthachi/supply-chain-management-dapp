import React, { useState } from "react";
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
  Input,
} from "antd";
import {
  PlusOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ReloadOutlined,
  CopyOutlined,
  SearchOutlined,
  EnvironmentOutlined,
  InfoCircleOutlined
} from "@ant-design/icons";
import { shortenAddress, copyToClipboard, convertTime } from "../utils/ui";

const { Title, Text } = Typography;

export default function ShipmentTable({
  setCreateShipmentModel,
  allShipmentsdata = [],
  loading,
  onRefresh,
}) {
  const [searchText, setSearchText] = useState("");

  const filteredData = React.useMemo(() => {
    const data = allShipmentsdata || [];
    if (!searchText) return data;
    const lower = searchText.toLowerCase();
    return data.filter(
      (item) =>
        item.id.toString().includes(lower) ||
        item.sender.toLowerCase().includes(lower) ||
        item.receiver.toLowerCase().includes(lower)
    );
  }, [allShipmentsdata, searchText]);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      fixed: "left",
      width: 80,
      render: (text) => (
        <Tooltip title="Copy ID">
          <Button
            type="text"
            size="small"
            icon={<CopyOutlined />}
            onClick={() => copyToClipboard(text, "Shipment ID")}
          >
            {text}
          </Button>
        </Tooltip>
      ),
    },
    {
      title: "Sender",
      dataIndex: "sender",
      key: "sender",
      render: (text) => (
        <Space size="small" className="bg-gray-50 px-2 py-1 rounded border border-gray-100">
          <Tooltip title={text}>
            <Text code className="!m-0">{shortenAddress(text)}</Text>
          </Tooltip>
          <Tooltip title="Copy Sender">
            <Button
              type="text"
              size="small"
              icon={<CopyOutlined />}
              onClick={() => copyToClipboard(text, "Sender Address")}
            />
          </Tooltip>
        </Space>
      ),
    },
    {
      title: "Receiver",
      dataIndex: "receiver",
      key: "receiver",
      render: (text) => (
        <Space size="small" className="bg-gray-50 px-2 py-1 rounded border border-gray-100">
          <Tooltip title={text}>
            <Text code className="!m-0">{shortenAddress(text)}</Text>
          </Tooltip>
          <Tooltip title="Copy Receiver">
            <Button
              type="text"
              size="small"
              icon={<CopyOutlined />}
              onClick={() => copyToClipboard(text, "Receiver Address")}
            />
          </Tooltip>
        </Space>
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
      render: (text) => <Text>{text} km</Text>
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (text) => <Text strong>{text} ETH</Text>,
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
        let icon = <InfoCircleOutlined />;
        
        if (status === 1) {
          color = "orange";
          text = "In Transit";
          icon = <EnvironmentOutlined />;
        } else if (status === 2) {
          color = "green";
          text = "Delivered";
          icon = <CheckCircleOutlined />;
        }
        return <Tag color={color} icon={icon}>{text.toUpperCase()}</Tag>;
      },
    },
    {
      title: "Payment",
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
          bordered={false}
        >
          {isPaid ? "PAID" : "UNPAID"}
        </Tag>
      ),
    },
  ];

  return (
    <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-8">
      <Row justify="space-between" align="middle" className="mb-6 flex-wrap gap-4">
        <Col>
          <div className="mb-4 md:mb-0">
            <Title level={3} style={{ marginBottom: 0 }}>
              Recent Shipments
            </Title>
            <Text type="secondary">
              Monitor the status and details of all on-chain logistics.
            </Text>
          </div>
        </Col>
        <Col>
          <Space direction="vertical" align="end" className="text-right">
             <Space size="small" className="mb-2">
               <Text type="secondary" className="text-xs uppercase tracking-wide font-semibold">
                 Total Shipments
               </Text>
               <Tag color="blue" className="rounded-xl px-2 font-bold">{allShipmentsdata?.length || 0}</Tag>
             </Space>
             
            <Space>
               <Input
                 placeholder="Search ID, Sender, Receiver..."
                 prefix={<SearchOutlined className="text-gray-400" />}
                 value={searchText}
                 onChange={(e) => setSearchText(e.target.value)}
                 style={{ width: 250 }}
                 allowClear
               />
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
                  className="bg-primary hover:bg-primary-dark border-primary font-medium shadow-sm"
                >
                  Add Shipment
                </Button>
            </Space>
          </Space>
        </Col>
      </Row>

      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey={(record) =>
          `${record.sender}-${record.receiver}-${record.pickupTime}-${record.id}`
        }
        pagination={{ pageSize: 8, showSizeChanger: true }}
        scroll={{ x: "max-content" }}
        className="shadow-card rounded-xl overflow-hidden border border-gray-100"
        loading={loading}
        locale={{
          emptyText: (
            <div className="py-12">
               <Empty description={<span>No shipments found matching your criteria.</span>}>
                {!searchText && (
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => setCreateShipmentModel(true)}
                    className="bg-primary hover:bg-primary-dark mt-4"
                  >
                    Create First Shipment
                  </Button>
                )}
              </Empty>
            </div>
          ),
        }}
      />
    </div>
  );
}
