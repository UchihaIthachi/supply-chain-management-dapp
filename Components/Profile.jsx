import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Modal, Card, Button, Avatar, Typography, Spin, Tooltip, Statistic, Row, Col } from "antd";

const { Title, Text } = Typography;

const ProfileModal = ({
  openProfile,
  setOpenProfile,
  currentUser,
  getShipmentsCount,
}) => {
  const [count, setCount] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    setOpenProfile(false);
  };

  useEffect(() => {
    if (!openProfile) return;

    let isMounted = true;

    const fetchCount = async () => {
      try {
        setLoading(true);
        const total = await getShipmentsCount();
        if (isMounted) setCount(total ?? 0);
      } catch (e) {
        console.error("Error fetching count", e);
        if (isMounted) setCount(0);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchCount();

    return () => {
      isMounted = false;
    };
  }, [openProfile, getShipmentsCount]);

  const shortenAddress = (addr) => {
    if (!addr) return null;
    if (addr.length <= 14) return addr;
    return `${addr.slice(0, 8)}...${addr.slice(-6)}`;
  };

  const shortened = shortenAddress(currentUser);

  return (
    <Modal
      open={openProfile}
      onCancel={handleClose}
      footer={null}
      centered
      width={520}
      maskClosable
      closable
      title="My Profile"
    >
        <div className="flex flex-col items-center gap-4 mb-6">
          <Avatar
            size={96}
            src={"/images/creator.jpg"} // Using path from previous implementation or valid asset
            className="shadow-lg border-2 border-primary"
          />
          <div className="text-center">
             <Title level={4} style={{ marginBottom: 4 }}>
              Welcome, Trader
            </Title>
             {shortened ? (
                <Tooltip title={currentUser}>
                  <Text
                    code
                    copyable={{ text: currentUser }}
                    className="cursor-pointer"
                  >
                    {shortened}
                  </Text>
                </Tooltip>
              ) : (
                <Text type="secondary">No wallet connected</Text>
              )}
          </div>
        </div>

        <Row gutter={16}>
          <Col span={12}>
             <Card bordered={false} className="shadow-sm bg-gray-50">
               <Statistic
                title="Balance"
                value={345} // Hardcoded in original, ideally fetched
                suffix="ETH"
                loading={loading}
               />
             </Card>
          </Col>
          <Col span={12}>
             <Card bordered={false} className="shadow-sm bg-gray-50">
               <Statistic
                title="Total Shipments"
                value={count ?? 0}
                loading={loading}
               />
             </Card>
          </Col>
        </Row>

        <div className="mt-6 flex justify-end">
           <Button onClick={handleClose}>Close</Button>
        </div>
    </Modal>
  );
};

export default ProfileModal;
