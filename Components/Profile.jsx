import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Modal, Card, Button, Avatar, Typography, Spin, Tooltip } from "antd";

import images from "../Images/index";

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
      bodyStyle={{ padding: 0 }}
      width={520}
      maskClosable
      closable
    >
      <div className="p-6 flex gap-6 items-start">
        {/* LEFT: avatar + close */}
        <div
          className="flex flex-col items-center gap-4"
          style={{ minWidth: 140 }}
        >
          <Avatar
            size={96}
            src={
              <Image src={images.avatar} alt="Avatar" width={96} height={96} />
            }
            className="shadow-lg"
          />
          <Button onClick={handleClose} block>
            Close
          </Button>
        </div>

        {/* RIGHT: wallet + stats */}
        <div className="flex-1 flex flex-col gap-4">
          <div>
            <Title level={4} style={{ marginBottom: 4 }}>
              Welcome, Trader
            </Title>
            <Text type="secondary" style={{ fontSize: 12 }}>
              Connected wallet
            </Text>
            <div style={{ marginTop: 4 }}>
              {shortened ? (
                <Tooltip title={currentUser}>
                  <Text
                    code
                    copyable={{ text: currentUser }}
                    style={{ maxWidth: 260, display: "inline-block" }}
                  >
                    {shortened}
                  </Text>
                </Tooltip>
              ) : (
                <Text type="secondary">No wallet connected</Text>
              )}
            </div>
          </div>

          <Card className="border-gray-200" bodyStyle={{ padding: 16 }}>
            <div className="flex items-center justify-between">
              <div>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  Total Shipments
                </Text>
              </div>
              <div>
                {loading ? (
                  <Spin size="small" />
                ) : (
                  <Title level={3} style={{ margin: 0 }}>
                    {count ?? 0}
                  </Title>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Modal>
  );
};

export default ProfileModal;
