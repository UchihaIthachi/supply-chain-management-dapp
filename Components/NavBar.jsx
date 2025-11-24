import { useEffect, useState, useContext } from "react";
import React from "react";
import { TrackingContext } from "../Context/TrackingContext";
import { Nav1, Nav2, Nav3 } from "../Components/index";
import { Layout, Menu, Button, Drawer, Typography } from "antd";
import { MenuOutlined, WalletOutlined } from "@ant-design/icons";

const { Header } = Layout;
const { Text } = Typography;

export default () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { currentUser, connectWallet } = useContext(TrackingContext);

  const navigation = [
    // { label: "Home", key: "home" },
    // { label: "Services", key: "services" },
    // { label: "Contact Us", key: "contact" },
    // { label: "Erc20", key: "erc20" }
  ];

  return (
    <Header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        width: '100%',
        backgroundColor: '#fff',
        display: 'flex',
        alignItems: 'center',
        padding: '0 20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
      }}
    >
      <div className="flex justify-between items-center w-full max-w-screen-xl mx-auto">
        <div className="logo" style={{ marginRight: 'auto' }}>
           <a href="#">
             {/* Using standard img tag for simplicity, or Next/Image */}
             <img src="logo.png" alt="Logo" style={{ height: 40 }} />
           </a>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center">
            {/* <Menu
                mode="horizontal"
                items={navigation}
                style={{ borderBottom: 'none', minWidth: 300, justifyContent: 'end' }}
            /> */}
            <div style={{ marginLeft: 20 }}>
                {currentUser ? (
                     <Button
                        type="default"
                        shape="round"
                        size="large"
                        style={{ borderColor: 'black', color: 'black' }}
                     >
                        {currentUser.slice(0, 25)}...
                     </Button>
                ) : (
                    <Button
                        type="primary"
                        shape="round"
                        size="large"
                        icon={<Nav3 />}
                        onClick={connectWallet}
                        style={{ backgroundColor: 'black', borderColor: 'black', display: 'flex', alignItems: 'center' }}
                    >
                        Connect Wallet
                    </Button>
                )}
            </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
            <Button
                type="text"
                icon={<MenuOutlined />}
                onClick={() => setMobileMenuOpen(true)}
                size="large"
            />
        </div>

        <Drawer
            title="Menu"
            placement="right"
            onClose={() => setMobileMenuOpen(false)}
            open={mobileMenuOpen}
        >
             {/* <Menu
                mode="vertical"
                items={navigation}
                style={{ borderRight: 'none' }}
            /> */}
            <div style={{ marginTop: 20 }}>
                {currentUser ? (
                     <Text ellipsis style={{ width: '100%' }}>{currentUser}</Text>
                ) : (
                    <Button
                        type="primary"
                        block
                        icon={<WalletOutlined />}
                        onClick={() => {
                            connectWallet();
                            setMobileMenuOpen(false);
                        }}
                        style={{ backgroundColor: 'black', borderColor: 'black' }}
                    >
                        Connect Wallet
                    </Button>
                )}
            </div>
        </Drawer>
      </div>
    </Header>
  );
};
