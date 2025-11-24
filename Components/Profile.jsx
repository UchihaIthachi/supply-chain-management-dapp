import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Modal, Card, Button, Avatar, Typography } from "antd";

//INTERNAL IMPORT
import images from "../Images/index";

const { Title, Text } = Typography;

export default ({
  openProfile,
  setOpenProfile,
  currentUser,
  getShipmentsCount,
}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const getShipmentsData = getShipmentsCount();

    return async () => {
      try {
        const allData = await getShipmentsData;
        setCount(allData);
      } catch (e) {
        console.error("Error fetching count", e);
      }
    };
  }, []);

  return (
    <Modal
      open={openProfile}
      onCancel={() => setOpenProfile(false)}
      footer={null}
      centered
      bodyStyle={{ padding: 0 }}
      closable={false} // Custom close if needed, but default X is fine. Set to false to match cleaner design
      width={400}
    >
      <div className="p-6 flex flex-col items-center">
        <Avatar
          size={96}
          src={<Image src={images.avatar} alt="Avatar" width={96} height={96} />}
          className="mb-4 shadow-lg"
        />
        <Title level={4} style={{ marginBottom: 4 }}>Welcome Trader</Title>
        <Text type="secondary" copyable ellipsis style={{ maxWidth: '100%' }}>
            {currentUser}
        </Text>

        <div className="mt-6 w-full">
            <Card className="text-center bg-gray-50 border-gray-200">
                <Text strong className="text-lg">Total Shipments</Text>
                <Title level={2} style={{ margin: '8px 0 0' }}>{count}</Title>
            </Card>
        </div>

        <div className="mt-6">
            <Button onClick={() => setOpenProfile(false)}>Close</Button>
        </div>
      </div>
    </Modal>
  );
};
