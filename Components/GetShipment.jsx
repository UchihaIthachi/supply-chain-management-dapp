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
} from "antd";
import {
  SearchOutlined,
  CopyOutlined,
  ReloadOutlined,
} from "@ant-design/icons";

const { Text, Paragraph } = Typography;

export default function ShipmentDetails({
  getModel,
  setGetModel,
  getShipment,
}) {
  const [index, setIndex] = useState("");
  const [singleShipmentData, setSingleShipmentData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    if (loading) return; // avoid closing mid-request
    setGetModel(false);
    setSingleShipmentData(null);
    setIndex("");
  };

  const getShipmentData = async () => {
    if (!index && index !== 0) {
      message.warning("Please enter a shipment ID.");
      return;
    }

    setLoading(true);
    try {
      const getData = await getShipment(index); // or Number(index) if needed
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
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(newTime);
  };

  const getStatusTag = (status) => {
    let color = "geekblue";
    let text = "PENDING";

    if (status === 1 || status === "1") {
      color = "orange";
      text = "IN TRANSIT";
    } else if (status === 2 || status === "2") {
      color = "green";
      text = "DELIVERED";
    }

    return <Tag color={color}>{text}</Tag>;
  };

  const copyToClipboard = (value, label) => {
    if (!value) return;
    navigator.clipboard
      .writeText(value)
      .then(() => message.success(`${label} copied to clipboard`))
      .catch(() => message.error("Failed to copy to clipboard"));
  };

  const renderAddress = (value, label) => {
    if (!value) return "-";
    const short = `${value.slice(0, 10)}...${value.slice(-6)}`;
    return (
      <Space size="small">
        <Tooltip title={value}>
          <Text code>{short}</Text>
        </Tooltip>
        <Tooltip title={`Copy ${label}`}>
          <Button
            size="small"
            type="text"
            icon={<CopyOutlined />}
            onClick={() => copyToClipboard(value, label)}
          />
        </Tooltip>
      </Space>
    );
  };

  return (
    <Modal
      title="Shipment Tracking Details"
      open={getModel}
      onCancel={handleClose}
      footer={null}
      destroyOnClose
      centered
      maskClosable={!loading}
      closable={!loading}
      width={600}
    >
      <div className="space-y-4">
        {/* Helper text */}
        <div>
          <Paragraph type="secondary" style={{ marginBottom: 4 }}>
            Enter a <Text strong>Shipment ID</Text> to view on-chain tracking
            details.
          </Paragraph>
          <Text type="secondary" style={{ fontSize: 12 }}>
            You can press <Text code>Enter</Text> or click{" "}
            <Text strong>Get Details</Text>.
          </Text>
        </div>

        {/* Search bar */}
        <Space.Compact style={{ width: "100%" }}>
          <Input
            placeholder="Enter Shipment ID"
            type="number"
            value={index}
            onChange={(e) => setIndex(e.target.value)}
            onPressEnter={getShipmentData}
          />
          <Button
            type="primary"
            icon={<SearchOutlined />}
            onClick={getShipmentData}
            loading={loading}
            disabled={!index && index !== 0}
            style={{ backgroundColor: "black", borderColor: "black" }}
          >
            Get Details
          </Button>
          <Button
            icon={<ReloadOutlined />}
            onClick={() => {
              setIndex("");
              setSingleShipmentData(null);
            }}
            disabled={loading}
          />
        </Space.Compact>

        {/* Content State */}
        <div style={{ minHeight: 180 }}>
          {loading ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
              }}
            >
              <Spin tip="Fetching shipment details..." />
            </div>
          ) : singleShipmentData ? (
            <Descriptions
              column={1}
              bordered
              size="small"
              labelStyle={{ width: 160 }}
            >
              <Descriptions.Item label="Shipment ID">
                <Text strong>{index}</Text>
              </Descriptions.Item>

              <Descriptions.Item label="Sender">
                {renderAddress(singleShipmentData.sender, "Sender address")}
              </Descriptions.Item>

              <Descriptions.Item label="Receiver">
                {renderAddress(singleShipmentData.receiver, "Receiver address")}
              </Descriptions.Item>

              <Descriptions.Item label="Pickup Time">
                {convertTime(singleShipmentData.pickupTime)}
              </Descriptions.Item>

              <Descriptions.Item label="Delivery Time">
                {convertTime(singleShipmentData.deliveryTime)}
              </Descriptions.Item>

              <Descriptions.Item label="Distance">
                {singleShipmentData.distance} km
              </Descriptions.Item>

              <Descriptions.Item label="Price">
                {singleShipmentData.price} ETH
              </Descriptions.Item>

              <Descriptions.Item label="Status">
                {getStatusTag(singleShipmentData.status)}
              </Descriptions.Item>

              <Descriptions.Item label="Payment Status">
                <Tag color={singleShipmentData.isPaid ? "green" : "red"}>
                  {singleShipmentData.isPaid ? "Completed" : "Not Complete"}
                </Tag>
              </Descriptions.Item>
            </Descriptions>
          ) : (
            <Empty
              description={
                <span>
                  No shipment loaded. Enter an ID and click{" "}
                  <Text strong>Get Details</Text>.
                </span>
              }
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          )}
        </div>
      </div>
    </Modal>
  );
}
