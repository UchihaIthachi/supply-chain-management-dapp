import React, { useState, useContext } from "react";
import { Layout, Button, Drawer, Typography, Tooltip, Dropdown, Menu, Modal } from "antd";
import {
  MenuOutlined,
  WalletOutlined,
  UserOutlined,
  DisconnectOutlined,
  SwapOutlined,
  CopyOutlined,
  HomeOutlined
} from "@ant-design/icons";
import { message } from "antd";
import { TrackingContext } from "../Context/TrackingContext";

const { Header } = Layout;
const { Text } = Typography;

const AppHeader = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [installModalOpen, setInstallModalOpen] = useState(false);
  const { currentUser, connectWallet, disconnectWallet, switchAccount } =
    useContext(TrackingContext);

  const shortenAddress = (addr) => {
    if (!addr) return "";
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const handleConnect = async () => {
    const result = await connectWallet();
    if (result === "Install MetaMask") {
      setInstallModalOpen(true);
    }
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
      type: 'divider',
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
           <div className="bg-gray-50 p-4 rounded-lg mb-2">
             <Text type="secondary" className="text-xs uppercase font-bold tracking-wider mb-1 block">Connected As</Text>
             <Text strong className="break-all">{currentUser}</Text>
           </div>
          <Button block icon={<CopyOutlined />} onClick={() => {
              navigator.clipboard.writeText(currentUser);
              message.success("Copied!");
          }}>
            Copy Address
          </Button>
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
          size="large"
          className="bg-primary hover:bg-primary-dark"
        >
          Connect Wallet
        </Button>
      )}
    </div>
  );

  return (
    <Header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 p-0 border-b border-gray-100">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between px-4 md:px-8 h-16">
        {/* LEFT: logo / title */}
        <a href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
           <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
             <HomeOutlined />
           </div>
          <Text strong className="text-lg tracking-tight text-gray-800">
            SupplyChain<span className="text-primary">DApp</span>
          </Text>
        </a>

        {/* RIGHT: connect + menu */}
        <div className="flex items-center gap-4">
          {/* desktop connect button */}
          <div className="hidden md:block">
            {currentUser ? (
              <Dropdown
                menu={{ items: userMenuItems }}
                placement="bottomRight"
                trigger={["click"]}
                arrow
              >
                <Button 
                    size="large"
                    type="default" 
                    shape="round" 
                    icon={<UserOutlined />}
                    className="border-gray-300 hover:border-primary hover:text-primary"
                >
                  {shortenAddress(currentUser)}
                </Button>
              </Dropdown>
            ) : (
              <Button
                type="primary"
                shape="round"
                size="large"
                icon={<WalletOutlined />}
                onClick={handleConnect}
                className="bg-primary hover:bg-primary-dark shadow-md hover:shadow-lg transition-all"
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
        title={<Text strong>Menu</Text>}
        placement="right"
        onClose={() => setMobileMenuOpen(false)}
        open={mobileMenuOpen}
        width={300}
      >
        {menuContent}
      </Drawer>

      <Modal
        title="Wallet Connection"
        open={installModalOpen}
        onCancel={() => setInstallModalOpen(false)}
        footer={null}
        centered
      >
        <div className="flex flex-col items-center justify-center p-4 gap-4 text-center">
          <WalletOutlined style={{ fontSize: '48px', color: '#1677ff' }} />
          <Typography.Title level={4}>MetaMask Not Found</Typography.Title>
          <Typography.Text type="secondary">
            It seems like you don't have MetaMask installed. Please install it to use this application.
          </Typography.Text>
          <div className="flex gap-2 w-full mt-4">
            <Button
              type="primary"
              block
              href="https://metamask.io/download/"
              target="_blank"
              size="large"
            >
              Install MetaMask
            </Button>
            <Button
              block
              onClick={() => window.location.reload()}
              size="large"
            >
              Reload Page
            </Button>
          </div>
        </div>
      </Modal>
    </Header>
  );
};

export default AppHeader;
