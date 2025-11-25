import { useState } from "react";
import {
  Modal,
  Form,
  Input,
  InputNumber,
  Button,
  Typography,
  Space,
  message,
} from "antd";

const { Text, Paragraph } = Typography;

const StartShipmentModal = ({ startModal, setStartModal, startShipment }) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleClose = () => {
    if (loading) return; // prevent closing while submitting
    form.resetFields();
    setStartModal(false);
  };

  const startShipping = async (values) => {
    setLoading(true);
    try {
      await startShipment({
        receiver: values.receiver.trim(),
        index: Number(values.index),
      });

      message.success("Shipment started successfully!");
      form.resetFields();
      setStartModal(false);
    } catch (error) {
      console.error("Error starting shipment", error);
      message.error("Failed to start shipment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Start Shipment"
      open={startModal}
      onCancel={handleClose}
      footer={null}
      destroyOnClose
      centered
      maskClosable={!loading}
      closable={!loading}
    >
      <div style={{ marginBottom: 16 }}>
        <Paragraph type="secondary" style={{ marginBottom: 4 }}>
          Initialize a new shipment by entering the{" "}
          <Text strong>receiver wallet address</Text> and the{" "}
          <Text strong>shipment ID</Text>.
        </Paragraph>
        <Text type="secondary" style={{ fontSize: 12 }}>
          Ensure the details match the shipment you intend to start on-chain.
        </Text>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={startShipping}
        autoComplete="off"
      >
        <Form.Item
          name="receiver"
          label="Receiver Wallet Address"
          rules={[
            { required: true, message: "Please input the receiver address!" },
            {
              pattern: /^0x[a-fA-F0-9]{40}$/,
              message: "Please enter a valid Ethereum address.",
            },
          ]}
          hasFeedback
        >
          <Input placeholder="0x1234...abcd" maxLength={42} />
        </Form.Item>

        <Form.Item
          name="index"
          label="Shipment ID"
          rules={[
            { required: true, message: "Please input shipment ID!" },
            {
              type: "number",
              min: 0,
              message: "Shipment ID must be a non-negative number.",
            },
          ]}
          hasFeedback
        >
          <InputNumber
            style={{ width: "100%" }}
            placeholder="Enter shipment ID"
          />
        </Form.Item>

        <Form.Item style={{ marginBottom: 0 }}>
          <Space style={{ width: "100%", justifyContent: "flex-end" }}>
            <Button onClick={handleClose} disabled={loading}>
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              style={{ backgroundColor: "black", borderColor: "black" }}
            >
              Start Shipment
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default StartShipmentModal;
