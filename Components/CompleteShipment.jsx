import { useState } from "react";
import { Modal, Form, Input, Button, message } from 'antd';

export default ({ completeModal, setCompleteModal, completeShipment }) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const changeStatus = async (values) => {
    setLoading(true);
    try {
      await completeShipment({
          receiver: values.receiver,
          index: values.index
      });
      message.success("Shipment completed successfully!");
      setCompleteModal(false);
      form.resetFields();
    } catch (error) {
        console.error("Error completing shipment", error);
        message.error("Failed to complete shipment.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <Modal
      title="Complete Shipment"
      open={completeModal}
      onCancel={() => setCompleteModal(false)}
      footer={null}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={changeStatus}
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
            Complete Shipment
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};
