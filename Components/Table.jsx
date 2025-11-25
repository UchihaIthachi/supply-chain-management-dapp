import React from 'react';
import { Table, Button, Typography, Tag, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export default ({ setCreateShipmentModel, allShipmentsdata }) => {
  const converTime = (time) => {
    const newTime = new Date(time);
    const dateTime = new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(newTime);
    return dateTime;
  };

  const columns = [
    {
      title: 'Sender',
      dataIndex: 'sender',
      key: 'sender',
      render: (text) => text ? `${text.slice(0, 15)}...` : '',
    },
    {
      title: 'Receiver',
      dataIndex: 'receiver',
      key: 'receiver',
      render: (text) => text ? `${text.slice(0, 15)}...` : '',
    },
    {
      title: 'Pickup Time',
      dataIndex: 'pickupTime',
      key: 'pickupTime',
      render: (text) => converTime(text),
    },
    {
      title: 'Distance',
      dataIndex: 'distance',
      key: 'distance',
      render: (text) => `${text} Km`,
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: 'Delivery Time',
      dataIndex: 'deliveryTime',
      key: 'deliveryTime',
      render: (text) => converTime(text), // Assuming deliveryTime is also a timestamp
    },
    {
      title: 'Paid',
      dataIndex: 'isPaid',
      key: 'isPaid',
      render: (isPaid) => (
        <Tag color={isPaid ? 'green' : 'red'}>
          {isPaid ? 'Completed' : 'Not Complete'}
        </Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = 'geekblue';
        let text = 'PENDING';
        if (status == 1) {
            color = 'orange';
            text = 'IN TRANSIT';
        } else if (status == 2) {
            color = 'green';
            text = 'DELIVERED';
        }
        return (
          <Tag color={color}>
            {text}
          </Tag>
        );
      },
    },
  ];

  return (
    <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <Title level={3} style={{ marginBottom: 0 }}>Shipment Tracking</Title>
          <Text type="secondary">Manage and track your shipments efficiently</Text>
        </div>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={() => setCreateShipmentModel(true)}
          size="large"
          style={{ backgroundColor: 'black', borderColor: 'black' }}
        >
          Add Tracking
        </Button>
      </div>
      
      <Table 
        columns={columns} 
        dataSource={allShipmentsdata} 
        rowKey={(record) => record.id || Math.random()} // fallback key if no id
        pagination={{ pageSize: 5 }}
        className="shadow-sm rounded-lg overflow-hidden"
      />
    </div>
  );
};
