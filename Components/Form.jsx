import React, { useState } from "react";
import { Modal, Form, Input, DatePicker, Button, message } from 'antd';

export default ({
  setCreateShipmentModel,
  createShipmentModel,
  createShipment,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onCreate = async (values) => {
    setLoading(true);
    try {
      const shipmentData = {
        receiver: values.receiver,
        pickupTime: values.pickupTime.format('YYYY-MM-DD'), // Format date for contract/api
        distance: values.distance,
        price: values.price,
      };
      await createShipment(shipmentData);
      message.success("Shipment created successfully!");
      setCreateShipmentModel(false);
      form.resetFields();
    } catch (error) {
      console.log("Error creating item", error);
      message.error("Failed to create shipment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Create Shipment"
      open={createShipmentModel}
      onCancel={() => setCreateShipmentModel(false)}
      footer={null}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onCreate}
      >
        <Form.Item
          name="receiver"
          label="Receiver Address"
          rules={[{ required: true, message: 'Please input receiver address!' }]}
        >
          <Input placeholder="0x..." />
        </Form.Item>

        <Form.Item
          name="pickupTime"
          label="Pickup Time"
          rules={[{ required: true, message: 'Please select pickup time!' }]}
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="distance"
          label="Distance"
          rules={[{ required: true, message: 'Please input distance!' }]}
        >
          <Input placeholder="Distance in Km" type="number" />
        </Form.Item>

        <Form.Item
          name="price"
          label="Price"
          rules={[{ required: true, message: 'Please input price!' }]}
        >
          <Input placeholder="Price in ETH" type="number" step="0.0001" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block style={{ backgroundColor: 'black', borderColor: 'black' }}>
            Create Shipment
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};
