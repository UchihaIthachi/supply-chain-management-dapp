import React from "react";
import { Layout, Row, Col, Typography, Space, Divider, Button } from "antd";
import {
  GithubOutlined,
  TwitterOutlined,
  LinkedinOutlined,
  MailOutlined
} from "@ant-design/icons";

const { Footer } = Layout;
const { Text, Link } = Typography;

const AppFooter = () => {
  const year = new Date().getFullYear();

  return (
    <Footer className="bg-gray-50 border-t border-gray-200 px-4 py-12">
      <div className="max-w-screen-xl mx-auto px-4">
        <Row gutter={[48, 32]} justify="space-between" align="top">
          {/* Brand + tagline */}
          <Col xs={24} md={8}>
            <Space direction="vertical" size={16}>
              <div>
                <Text strong className="text-xl block text-gray-800">
                  SupplyChain<span className="text-primary">DApp</span>
                </Text>
                <Text type="secondary" className="text-sm mt-2 block leading-relaxed">
                  A transparent, decentralized shipment tracking solution built on Ethereum. 
                  Securely manage your logistics with the power of blockchain.
                </Text>
              </div>
              <Space>
                 <Button shape="circle" icon={<GithubOutlined />} href="#" target="_blank" />
                 <Button shape="circle" icon={<TwitterOutlined />} href="#" target="_blank" />
                 <Button shape="circle" icon={<LinkedinOutlined />} href="#" target="_blank" />
              </Space>
            </Space>
          </Col>

          {/* Links */}
          <Col xs={24} md={12}>
            <Row gutter={[24, 16]}>
              <Col xs={12} sm={8}>
                <Space direction="vertical" size={12}>
                  <Text strong className="uppercase text-xs tracking-wider text-gray-500">Platform</Text>
                  <Link href="#" className="text-gray-600 hover:text-primary transition-colors">Home</Link>
                  <Link href="#" className="text-gray-600 hover:text-primary transition-colors">Dashboard</Link>
                  <Link href="#" className="text-gray-600 hover:text-primary transition-colors">Tracking</Link>
                </Space>
              </Col>
              <Col xs={12} sm={8}>
                <Space direction="vertical" size={12}>
                  <Text strong className="uppercase text-xs tracking-wider text-gray-500">Resources</Text>
                  <Link href="#" className="text-gray-600 hover:text-primary transition-colors">Documentation</Link>
                  <Link href="#" className="text-gray-600 hover:text-primary transition-colors">Smart Contracts</Link>
                  <Link href="#" className="text-gray-600 hover:text-primary transition-colors">Status</Link>
                </Space>
              </Col>
               <Col xs={12} sm={8}>
                <Space direction="vertical" size={12}>
                  <Text strong className="uppercase text-xs tracking-wider text-gray-500">Company</Text>
                  <Link href="#" className="text-gray-600 hover:text-primary transition-colors">About</Link>
                  <Link href="#" className="text-gray-600 hover:text-primary transition-colors">Contact</Link>
                  <Link href="#" className="text-gray-600 hover:text-primary transition-colors">Privacy</Link>
                </Space>
              </Col>
            </Row>
          </Col>
        </Row>

        <Divider className="my-8" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <Text type="secondary" className="text-xs">
            © {year} SupplyChain DApp. All rights reserved.
          </Text>
          <div className="flex gap-4">
             <Link href="#" className="text-xs text-gray-500 hover:text-primary">Terms of Service</Link>
             <Link href="#" className="text-xs text-gray-500 hover:text-primary">Privacy Policy</Link>
             <Link href="#" className="text-xs text-gray-500 hover:text-primary">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </Footer>
  );
};

export default AppFooter;
