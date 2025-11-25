import React, { useState, useContext } from "react";
import { Layout, Button, Drawer, Typography, Tooltip, Row, Col, Space } from "antd";
import { MenuOutlined, WalletOutlined } from "@ant-design/icons";
import { TrackingContext } from "../Context/TrackingContext";

const { Header } = Layout;
const { Text } = Typography;

const AppHeader = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { currentUser, connectWallet } = useContext(TrackingContext);

  const shortenAddress = (addr) => {
    if (!addr) return "";
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const handleConnect = async () => {
    await connectWallet();
  };

  const menuContent = (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {currentUser ? (
        <Tooltip title={currentUser}>
          <Button type="default" block>
            {shortenAddress(currentUser)}
          </Button>
        </Tooltip>
      ) : (
        <Button
          type="primary"
          block
          onClick={async () => {
            await handleConnect();
            setMobileMenuOpen(false);
          }}
          className="bg-primary-light hover:bg-primary-dark"
        >
          Connect Wallet
        </Button>
      )}
    </div>
  );

  return (
    <Header className="bg-white shadow-sm sticky top-0 z-50 px-4">
      <div className="max-w-screen-xl mx-auto">
        <Row justify="space-between" align="middle" className="h-full">
          <Col>
            <a href="#">
              <img src="/logo.png" alt="Logo" className="h-6" />
            </a>
          </Col>
          <Col>
            <Space align="center">
              <div className="hidden md:block">
                {currentUser ? (
                  <Tooltip title={currentUser}>
                    <Button type="default" shape="round">
                      {shortenAddress(currentUser)}
                    </Button>
                  </Tooltip>
                ) : (
                  <Button
                    type="primary"
                    shape="round"
                    icon={<WalletOutlined />}
                    onClick={handleConnect}
                    className="bg-primary hover:bg-primary-dark flex items-center"
                  >
                    Connect Wallet
                  </Button>
                )}
              </div>
              <Button
                className="md:hidden"
                type="text"
                icon={<MenuOutlined />}
                onClick={() => setMobileMenuOpen(true)}
              />
            </Space>
          </Col>
        </Row>
      </div>
      <Drawer
        title="Menu"
        placement="right"
        onClose={() => setMobileMenuOpen(false)}
        open={mobileMenuOpen}
      >
        {menuContent}
      </Drawer>
    </Header>
  );
};

export default AppHeader;
