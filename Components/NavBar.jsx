import React, { useState, useContext } from "react";
import { Layout, Button, Drawer, Typography, Tooltip } from "antd";
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
          icon={<WalletOutlined />}
          onClick={async () => {
            await handleConnect();
            setMobileMenuOpen(false);
          }}
          style={{ backgroundColor: "#1677ff", borderColor: "#1677ff" }}
        >
          Connect Wallet
        </Button>
      )}
    </div>
  );

  return (
    <Header className="bg-white shadow-sm sticky top-0 z-50 p-0">
      {/* main navbar container */}
      <div className="max-w-screen-xl mx-auto flex items-center justify-between px-4 h-16">
        {/* LEFT: logo / title */}
        <a href="#" className="flex items-center gap-2">
          {/* <img src="/logo.png" alt="Logo" className="h-7" /> */}
          <Text strong className="text-lg">
            Supply Chain
          </Text>
        </a>

        {/* RIGHT: connect + menu */}
        <div className="flex items-center gap-8">
          {/* desktop connect button */}
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
                style={{
                  backgroundColor: "#1677ff",
                  borderColor: "#1677ff",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                Connect Wallet
              </Button>
            )}
          </div>

          {/* mobile menu button */}
          <Button
            className="md:hidden"
            type="text"
            icon={<MenuOutlined style={{ fontSize: 22 }} />}
            onClick={() => setMobileMenuOpen(true)}
          />
        </div>
      </div>

      {/* mobile drawer */}
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
