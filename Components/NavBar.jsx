import React, { useState, useContext } from "react";
import { Layout, Button, Drawer, Typography, Tooltip, Dropdown } from "antd";
import {
  MenuOutlined,
  WalletOutlined,
  UserOutlined,
  DisconnectOutlined,
  SwapOutlined,
  CopyOutlined,
} from "@ant-design/icons";
import { message } from "antd";
import { TrackingContext } from "../Context/TrackingContext";

const { Header } = Layout;
const { Text } = Typography;

const AppHeader = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { currentUser, connectWallet, disconnectWallet, switchAccount } =
    useContext(TrackingContext);

  const shortenAddress = (addr) => {
    if (!addr) return "";
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const handleConnect = async () => {
    await connectWallet();
  };

  const userMenuItems = [
    {
      key: "copy",
      icon: <CopyOutlined />,
      label: "Copy Address",
      onClick: () => {
        if (currentUser) {
          navigator.clipboard.writeText(currentUser);
          message.success("Address copied successfully!");
        }
      },
    },
    {
      key: "switch",
      icon: <SwapOutlined />,
      label: "Switch Account",
      onClick: switchAccount,
    },
    {
      key: "disconnect",
      icon: <DisconnectOutlined />,
      label: "Disconnect",
      danger: true,
      onClick: disconnectWallet,
    },
  ];

  const menuContent = (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {currentUser ? (
        <>
          <Tooltip title={currentUser}>
            <Button type="default" block icon={<UserOutlined />}>
              {shortenAddress(currentUser)}
            </Button>
          </Tooltip>
          <Button block icon={<SwapOutlined />} onClick={switchAccount}>
            Switch Account
          </Button>
          <Button
            block
            danger
            icon={<DisconnectOutlined />}
            onClick={disconnectWallet}
          >
            Disconnect
          </Button>
        </>
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
              <Dropdown
                menu={{ items: userMenuItems }}
                placement="bottomRight"
                trigger={["click"]}
              >
                <Button type="default" shape="round" icon={<UserOutlined />}>
                  {shortenAddress(currentUser)}
                </Button>
              </Dropdown>
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
