import { useState } from "react";
import { Modal, Form, Input, Button, message } from 'antd';

export default ({ startModal, setStartModal, startShipment }) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const startShipping = async (values) => {
    setLoading(true);
    try {
      await startShipment({
          receiver: values.receiver,
          index: values.index
      });
      message.success("Shipment started successfully!");
      setStartModal(false);
      form.resetFields();
    } catch (error) {
        console.error("Error starting shipment", error);
        message.error("Failed to start shipment.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <Modal
      title="Start Shipment"
      open={startModal}
      onCancel={() => setStartModal(false)}
      footer={null}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={startShipping}
      >
        <Form.Item
          name="receiver"
          label="Receiver Address"
          rules={[{ required: true, message: 'Please input receiver address!' }]}
        >
          <Input placeholder="0x..." />
        </Form.Item>

        <Form.Item
          name="index"
          label="Shipment ID"
          rules={[{ required: true, message: 'Please input shipment ID!' }]}
        >
          <Input type="number" placeholder="ID" />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            block
            style={{ backgroundColor: 'black', borderColor: 'black' }}
          >
            Start Shipment
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};
