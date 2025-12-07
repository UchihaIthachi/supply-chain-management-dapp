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
import { CheckCircleOutlined } from "@ant-design/icons";

const { Text, Title, Paragraph } = Typography;

const CompleteShipmentModal = ({
  completeModal,
  setCompleteModal,
  completeShipment,
  uniqueAddresses,
}) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleClose = () => {
    if (loading) return;
    form.resetFields();
    setCompleteModal(false);
  };

  const changeStatus = async (values) => {
    setLoading(true);
    try {
      await completeShipment({
        recevier: values.receiver.trim(),
        index: Number(values.index),
      });

      message.success("Shipment completed and payment released!");
      form.resetFields();
      setCompleteModal(false);
    } catch (error) {
      console.error("Error completing shipment", error);
      message.error("Failed to complete shipment. Verify ID and permissions.");
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
      title={<Title level={4} style={{ margin: 0 }}>Complete Shipment</Title>}
      open={completeModal}
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
            message="Finalize Delivery"
            description="Completing this shipment will mark it as Delivered and release the payment to the sender."
            type="success"
            showIcon
            className="mb-4"
          />
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={changeStatus}
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
              icon={<CheckCircleOutlined />}
              size="large"
              className="bg-green-600 hover:bg-green-700 border-green-600 font-semibold"
            >
              Complete Shipment
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CompleteShipmentModal;
