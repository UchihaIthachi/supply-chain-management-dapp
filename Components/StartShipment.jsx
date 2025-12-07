import { useState } from "react";
import {
  Modal,
  Form,
  InputNumber,
  Button,
  Typography,
  Space,
  message,
  AutoComplete,
  Divider,
  Alert
} from "antd";
import { RocketOutlined } from "@ant-design/icons";

const { Text, Title, Paragraph } = Typography;

const StartShipmentModal = ({
  startModal,
  setStartModal,
  startShipment,
  uniqueAddresses,
}) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleClose = () => {
    if (loading) return; 
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
      message.error("Failed to start shipment. Please check the ID or your wallet permissions.");
    } finally {
      setLoading(false);
    }
  };

  const options = (uniqueAddresses || []).map((addr) => ({
    value: addr,
    label: addr,
  }));

  return (
    <Modal
      title={<Title level={4} style={{ margin: 0 }}>Start Shipment Transit</Title>}
      open={startModal}
      onCancel={handleClose}
      footer={null}
      destroyOnClose
      centered
      maskClosable={!loading}
      closable={!loading}
      width={500}
      bodyStyle={{ padding: '24px' }}
    >
      <div className="mb-6">
          <Alert
            message="Action Required"
            description="Starting a shipment changes its status to 'In Transit'. This action is irreversible on the blockchain."
            type="info"
            showIcon
            className="mb-4"
          />
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={startShipping}
        autoComplete="off"
        size="large"
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
          <AutoComplete
            options={options}
            placeholder="0x..."
            filterOption={(inputValue, option) =>
              option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
            }
          />
        </Form.Item>

        <Form.Item
          name="index"
          label="Shipment ID"
          rules={[
            { required: true, message: "Please input shipment ID!" },
            {
              type: "number",
              min: 0,
              message: "Invalid ID.",
            },
          ]}
          hasFeedback
        >
          <InputNumber
            style={{ width: "100%" }}
            placeholder="e.g. 23"
          />
        </Form.Item>

        <Divider />

        <Form.Item style={{ marginBottom: 0 }}>
          <Space style={{ width: "100%", justifyContent: "flex-end" }}>
            <Button onClick={handleClose} disabled={loading} size="large">
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              icon={<RocketOutlined />}
              size="large"
              className="bg-primary hover:bg-primary-dark border-primary font-semibold"
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
