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
} from "antd";

const { Text, Paragraph } = Typography;

const CreateShipmentModal = ({
  setCreateShipmentModel,
  createShipmentModel,
  createShipment,
  uniqueAddresses,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    if (loading) return; // avoid closing while submitting
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
        price: values.price.toString(), // Keep as string for parsing
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
      title="Create Shipment"
      open={createShipmentModel}
      onCancel={handleClose}
      footer={null}
      centered
      destroyOnClose
      maskClosable={!loading}
      closable={!loading}
    >
      {/* Helper text */}
      <div style={{ marginBottom: 16 }}>
        <Paragraph type="secondary" style={{ marginBottom: 4 }}>
          Fill in the shipment details to create a{" "}
          <Text strong>new on-chain shipment</Text>.
        </Paragraph>
        <Text type="secondary" style={{ fontSize: 12 }}>
          Make sure the receiver address and pricing are correct before
          submitting — updates later may require a separate transaction.
        </Text>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={onCreate}
        autoComplete="off"
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
          name="pickupTime"
          label="Pickup Date"
          rules={[{ required: true, message: "Please select pickup date!" }]}
          hasFeedback
        >
          <DatePicker
            style={{ width: "100%" }}
            placeholder="Select pickup date"
          />
        </Form.Item>

        <Form.Item
          name="distance"
          label="Distance (km)"
          rules={[
            { required: true, message: "Please input distance!" },
            {
              type: "number",
              min: 1,
              message: "Distance must be at least 1 km.",
            },
          ]}
          hasFeedback
        >
          <InputNumber
            style={{ width: "100%" }}
            placeholder="Distance in km"
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
              message: "Price must be a positive value.",
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
            placeholder="Price in ETH"
            min={0}
            step={0.0001}
            stringMode
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
              Create Shipment
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateShipmentModal;
