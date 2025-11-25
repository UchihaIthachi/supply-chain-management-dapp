// components/AppHeader.jsx
import React, { useState, useContext } from "react";
import { Layout, Button, Drawer, Typography, Tooltip } from "antd";
import { MenuOutlined, WalletOutlined } from "@ant-design/icons";
import { TrackingContext } from "../Context/TrackingContext";
import { Nav3 } from "../Components/index";

const { Header } = Layout;
const { Text } = Typography;

const AppHeader = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { currentUser, connectWallet } = useContext(TrackingContext);

  const shortenAddress = (addr) => {
    if (!addr) return "";
    if (addr.length <= 14) return addr;
    return `${addr.slice(0, 8)}...${addr.slice(-6)}`;
  };

  const handleConnect = async () => {
    await connectWallet();
  };

  return (
    <Header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 1000,
        width: "100%",
        backgroundColor: "#ffffff",
        display: "flex",
        alignItems: "center",
        padding: "0 16px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
      }}
    >
      <div className="flex justify-between items-center w-full max-w-screen-xl mx-auto">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2">
          <img
            src="/logo.png"
            alt="Pull Stackers Logo"
            style={{ height: 34 }}
          />
        </a>

        {/* Desktop actions */}
        <div className="hidden md:flex items-center">
          {currentUser ? (
            <Tooltip title={currentUser}>
              <Button
                type="default"
                shape="round"
                size="middle"
                style={{
                  borderColor: "black",
                  color: "black",
                  fontFamily: "monospace",
                }}
              >
                {shortenAddress(currentUser)}
              </Button>
            </Tooltip>
          ) : (
            <Button
              type="primary"
              shape="round"
              size="middle"
              icon={<Nav3 />}
              onClick={handleConnect}
              style={{
                backgroundColor: "black",
                borderColor: "black",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              Connect Wallet
            </Button>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <Button
            type="text"
            icon={<MenuOutlined />}
            onClick={() => setMobileMenuOpen(true)}
            size="large"
            aria-label="Open menu"
          />
        </div>

        {/* Mobile Drawer */}
        <Drawer
          title={
            <div className="flex items-center justify-between">
              <span>Menu</span>
            </div>
          }
          placement="right"
          onClose={() => setMobileMenuOpen(false)}
          open={mobileMenuOpen}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <Text type="secondary" style={{ fontSize: 12 }}>
                Wallet
              </Text>
              <div style={{ marginTop: 4 }}>
                {currentUser ? (
                  <Tooltip title={currentUser}>
                    <Text
                      code
                      ellipsis
                      style={{ maxWidth: "100%", display: "inline-block" }}
                    >
                      {shortenAddress(currentUser)}
                    </Text>
                  </Tooltip>
                ) : (
                  <Button
                    type="primary"
                    block
                    icon={<WalletOutlined />}
                    onClick={async () => {
                      await handleConnect();
                      setMobileMenuOpen(false);
                    }}
                    style={{ backgroundColor: "black", borderColor: "black" }}
                  >
                    Connect Wallet
                  </Button>
                )}
              </div>
            </div>

            {/* Future nav items go here */}
            {/* <Button type="text" block>Dashboard</Button> */}
          </div>
        </Drawer>
      </div>
    </Header>
  );
};

export default AppHeader;
