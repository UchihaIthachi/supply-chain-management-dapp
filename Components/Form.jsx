import React, { useState } from "react";
import {
  Modal,
  Form,
  Input,
  DatePicker,
  InputNumber,
  Button,
  Typography,
  Space,
  message,
  AutoComplete,
  Divider
} from "antd";
import { PlusOutlined } from "@ant-design/icons";

const { Text, Paragraph, Title } = Typography;

const CreateShipmentModal = ({
  setCreateShipmentModel,
  createShipmentModel,
  createShipment,
  uniqueAddresses,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    if (loading) return; 
    setCreateShipmentModel(false);
    form.resetFields();
  };

  const onCreate = async (values) => {
    setLoading(true);
    try {
      const shipmentData = {
        receiver: values.receiver.trim(),
        pickupTime: values.pickupTime.format("YYYY-MM-DD"),
        distance: Number(values.distance),
        price: values.price.toString(),
      };

      await createShipment(shipmentData);
      message.success("Shipment created successfully!");
      handleClose();
    } catch (error) {
      console.log("Error creating item", error);
      message.error("Failed to create shipment. Please try again.");
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
      title={<Title level={4} style={{ margin: 0 }}>Create New Shipment</Title>}
      open={createShipmentModel}
      onCancel={handleClose}
      footer={null}
      centered
      destroyOnClose
      maskClosable={!loading}
      closable={!loading}
      width={600}
      bodyStyle={{ padding: '24px' }}
    >
      <div className="mb-6 bg-blue-50 p-4 rounded-lg border border-blue-100">
        <Paragraph style={{ marginBottom: 4, color: '#003eb3' }}>
          <span role="img" aria-label="info">ℹ️</span> Fill in the details below to initialize a <Text strong style={{ color: '#003eb3' }}>new on-chain shipment</Text>.
        </Paragraph>
        <Text style={{ fontSize: 12, color: '#003eb3' }}>
          Double-check the receiver address. This action incurs gas fees.
        </Text>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={onCreate}
        autoComplete="off"
        size="large"
      >
        <Form.Item
          name="receiver"
          label="Receiver Wallet Address"
          rules={[
            { required: true, message: "Please input receiver address!" },
            {
              pattern: /^0x[a-fA-F0-9]{40}$/,
              message: "Please enter a valid Ethereum address.",
            },
          ]}
          hasFeedback
          tooltip="The wallet address that will receive the shipment."
        >
          <AutoComplete
            options={options}
            placeholder="0x..."
            filterOption={(inputValue, option) =>
              option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
            }
            autoFocus
          />
        </Form.Item>

        <Form.Item
          name="pickupTime"
          label="Pickup Date"
          rules={[{ required: true, message: "Please select pickup date!" }]}
          hasFeedback
        >
          <DatePicker
            style={{ width: "100%" }}
            placeholder="Select date"
          />
        </Form.Item>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            name="distance"
            label="Distance (km)"
            rules={[
              { required: true, message: "Please input distance!" },
              {
                type: "number",
                min: 1,
                message: "Must be at least 1 km.",
              },
            ]}
            hasFeedback
          >
            <InputNumber
              style={{ width: "100%" }}
              placeholder="e.g., 150"
              min={1}
            />
          </Form.Item>

          <Form.Item
            name="price"
            label="Price (ETH)"
            rules={[
              { required: true, message: "Please input price!" },
              {
                type: "number",
                min: 0,
                message: "Must be positive.",
                transform: (value) => {
                  if (value === undefined || value === "") return NaN;
                  return Number(value);
                },
              },
            ]}
            hasFeedback
          >
            <InputNumber
              style={{ width: "100%" }}
              placeholder="e.g., 0.05"
              min={0}
              step={0.0001}
              stringMode
              addonAfter="ETH"
            />
          </Form.Item>
        </div>

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
              icon={<PlusOutlined />}
              size="large"
              className="bg-primary hover:bg-primary-dark border-primary font-semibold px-8"
            >
              Create Shipment
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateShipmentModal;
