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
  AutoComplete,
} from "antd";

const { Text, Paragraph } = Typography;

const CompleteShipmentModal = ({
  completeModal,
  setCompleteModal,
  completeShipment,
  uniqueAddresses,
}) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleClose = () => {
    if (loading) return; // prevent closing while submitting
    form.resetFields();
    setCompleteModal(false);
  };

  const changeStatus = async (values) => {
    setLoading(true);
    try {
      await completeShipment({
        recevier: values.receiver.trim(), // Note: Context expects 'recevier' (typo in context)
        index: Number(values.index),
      });

      message.success("Shipment completed successfully!");
      form.resetFields();
      setCompleteModal(false);
    } catch (error) {
      console.error("Error completing shipment", error);
      message.error("Failed to complete shipment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Prepare autocomplete options
  const options = (uniqueAddresses || []).map((addr) => ({
    value: addr,
    label: addr,
  }));

  return (
    <Modal
      title="Complete Shipment"
      open={completeModal}
      onCancel={handleClose}
      footer={null}
      destroyOnClose
      centered
      maskClosable={!loading}
      closable={!loading}
    >
      <div style={{ marginBottom: 16 }}>
        <Paragraph type="secondary" style={{ marginBottom: 4 }}>
          Confirm the shipment completion by providing the{" "}
          <Text strong>receiver address</Text> and the{" "}
          <Text strong>shipment ID</Text>.
        </Paragraph>
        <Text type="secondary" style={{ fontSize: 12 }}>
          Make sure the details match the on-chain shipment before submitting.
        </Text>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={changeStatus}
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
          <AutoComplete
            options={options}
            placeholder="0x1234...abcd"
            filterOption={(inputValue, option) =>
              option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !==
              -1
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
              className="bg-primary hover:bg-primary-dark border-primary"
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
