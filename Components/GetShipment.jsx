import { useState } from "react";
import {
  Modal,
  Input,
  Button,
  Descriptions,
  Tag,
  Typography,
  Space,
  Empty,
  Spin,
  Tooltip,
  message,
  Card,
  Divider
} from "antd";
import {
  SearchOutlined,
  CopyOutlined,
  ReloadOutlined,
  EnvironmentOutlined,
  DollarOutlined,
  CalendarOutlined,
  UserOutlined,
  InfoCircleOutlined
} from "@ant-design/icons";

const { Text, Title, Paragraph } = Typography;

export default function ShipmentDetails({
  getModel,
  setGetModel,
  getShipment,
}) {
  const [index, setIndex] = useState("");
  const [singleShipmentData, setSingleShipmentData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    if (loading) return; 
    setGetModel(false);
    setSingleShipmentData(null);
    setIndex("");
  };

  const getShipmentData = async () => {
    if (!index && index !== 0) {
      message.warning("Please enter a valid Shipment ID.");
      return;
    }

    setLoading(true);
    try {
      const getData = await getShipment(index); 
      setSingleShipmentData(getData);
      if (!getData) {
        message.warning("No shipment found for that ID.");
      }
    } catch (error) {
      console.error("Error fetching shipment data:", error);
      message.error("Could not find shipment with that ID.");
      setSingleShipmentData(null);
    } finally {
      setLoading(false);
    }
  };

  const convertTime = (time) => {
    if (!time || Number(time) === 0) return "-";
    const newTime = new Date(time);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(newTime);
  };

  const getStatusTag = (status) => {
    let color = "geekblue";
    let text = "PENDING";
    let icon = <InfoCircleOutlined />;

    if (status === 1 || status === "1") {
      color = "orange";
      text = "IN TRANSIT";
      icon = <EnvironmentOutlined />;
    } else if (status === 2 || status === "2") {
      color = "green";
      text = "DELIVERED";
      icon = <CheckCircleOutlined />;
    }

    return (
      <Tag color={color} icon={icon} className="px-3 py-1 text-sm font-medium rounded-full">
        {text}
      </Tag>
    );
  };

  // Icon component import was missing CheckCircleOutlined, fixing here safely
  const CheckCircleOutlined = require("@ant-design/icons").CheckCircleOutlined;


  const copyToClipboard = (value, label) => {
    if (!value) return;
    navigator.clipboard
      .writeText(value)
      .then(() => message.success(`${label} copied!`))
      .catch(() => message.error("Failed to copy"));
  };

  const renderAddress = (value, label) => {
    if (!value) return <Text disabled>Not available</Text>;
    const short = `${value.slice(0, 10)}...${value.slice(-8)}`;
    return (
      <Space size="small" className="bg-gray-50 px-2 py-1 rounded border border-gray-200">
        <Tooltip title={value}>
          <Text code className="!m-0">{short}</Text>
        </Tooltip>
        <Tooltip title={`Copy ${label}`}>
          <Button
            size="small"
            type="text"
            icon={<CopyOutlined />}
            onClick={() => copyToClipboard(value, label)}
            className="text-gray-500 hover:text-primary"
          />
        </Tooltip>
      </Space>
    );
  };

  return (
    <Modal
      title={<Title level={4} style={{ margin: 0 }}>Track Shipment</Title>}
      open={getModel}
      onCancel={handleClose}
      footer={null}
      destroyOnClose
      centered
      maskClosable={!loading}
      closable={!loading}
      width={650}
      bodyStyle={{ padding: '24px' }}
    >
      <div className="space-y-6">
        
        {/* Search Header */}
        <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 flex flex-col items-center justify-center gap-4">
          <div className="text-center">
             <Title level={5} className="!mb-1 text-blue-800">Lookup Shipment</Title>
             <Text type="secondary" className="text-blue-600">Enter the ID below to view real-time status.</Text>
          </div>
          
          <Space.Compact style={{ width: "100%", maxWidth: 400 }} size="large">
            <Input
              placeholder="e.g., 0, 1, 2..."
              type="number"
              value={index}
              onChange={(e) => setIndex(e.target.value)}
              onPressEnter={getShipmentData}
              prefix={<SearchOutlined className="text-gray-400" />}
            />
            <Button
              type="primary"
              onClick={getShipmentData}
              loading={loading}
              disabled={!index && index !== 0}
              className="bg-primary hover:bg-primary-dark border-primary px-6"
            >
              Track
            </Button>
            <Tooltip title="Clear Search">
                <Button
                icon={<ReloadOutlined />}
                onClick={() => {
                    setIndex("");
                    setSingleShipmentData(null);
                }}
                disabled={loading}
                />
            </Tooltip>
          </Space.Compact>
        </div>

        <Divider />

        {/* Content State */}
        <div className="min-h-[250px] relative">
          {loading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white bg-opacity-80 z-10">
              <Spin size="large" />
              <Text type="secondary" className="mt-4">Fetching blockchain data...</Text>
            </div>
          ) : singleShipmentData ? (
            <Card 
                bordered={false} 
                className="shadow-sm border border-gray-100" 
                bodyStyle={{ padding: 0 }}
            >
              <Descriptions
                bordered
                column={1}
                size="middle"
                labelStyle={{ width: '35%', background: '#fafafa', color: '#666', fontWeight: 500 }}
                contentStyle={{ background: '#fff', fontWeight: 500 }}
              >
                <Descriptions.Item label={<Space><InfoCircleOutlined /> Shipment ID</Space>}>
                  <Space>
                    <Text strong className="text-lg">{index}</Text>
                    <Tooltip title="Copy ID">
                      <Button
                        size="small"
                        type="text"
                        icon={<CopyOutlined />}
                        onClick={() => copyToClipboard(index, "Shipment ID")}
                      />
                    </Tooltip>
                  </Space>
                </Descriptions.Item>

                <Descriptions.Item label={<Space><UserOutlined /> Sender</Space>}>
                  {renderAddress(singleShipmentData.sender, "Sender address")}
                </Descriptions.Item>

                <Descriptions.Item label={<Space><UserOutlined /> Receiver</Space>}>
                  {renderAddress(singleShipmentData.receiver, "Receiver address")}
                </Descriptions.Item>

                <Descriptions.Item label={<Space><CalendarOutlined /> Pickup</Space>}>
                  {convertTime(singleShipmentData.pickupTime)}
                </Descriptions.Item>

                <Descriptions.Item label={<Space><CalendarOutlined /> Delivery</Space>}>
                  {convertTime(singleShipmentData.deliveryTime)}
                </Descriptions.Item>

                <Descriptions.Item label={<Space><EnvironmentOutlined /> Distance</Space>}>
                  {singleShipmentData.distance} km
                </Descriptions.Item>

                <Descriptions.Item label={<Space><DollarOutlined /> Price</Space>}>
                  <Text type="success" strong>{singleShipmentData.price} ETH</Text>
                </Descriptions.Item>

                <Descriptions.Item label="Current Status">
                  {getStatusTag(singleShipmentData.status)}
                </Descriptions.Item>

                <Descriptions.Item label="Payment">
                  <Tag 
                    color={singleShipmentData.isPaid ? "success" : "error"} 
                    className="rounded-full px-3"
                  >
                    {singleShipmentData.isPaid ? "PAID" : "UNPAID"}
                  </Tag>
                </Descriptions.Item>
              </Descriptions>
            </Card>
          ) : (
            <div className="flex flex-col items-center justify-center h-full py-12">
                <Empty
                description={
                    <span className="text-gray-500">
                    No shipment data loaded yet.
                    </span>
                }
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
