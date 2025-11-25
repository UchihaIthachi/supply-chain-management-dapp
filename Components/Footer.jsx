import React from "react";
import { Layout, Row, Col, Typography, Space, Divider } from "antd";
import { GithubOutlined, TwitterOutlined, LinkedinOutlined } from "@ant-design/icons";

const { Footer } = Layout;
const { Text, Link } = Typography;

const AppFooter = () => {
  return (
    <Footer className="bg-white border-t border-gray-200 py-8 px-4">
      <div className="max-w-screen-xl mx-auto">
        <Row justify="space-between" align="top" gutter={[16, 32]}>
          <Col xs={24} md={8}>
            <Space direction="vertical">
              <Space align="center">
                <img src="/logo.png" alt="Logo" className="h-6" />
                <Text strong>Supply Chain DApp</Text>
              </Space>
              <Text type="secondary" className="text-sm">
                Decentralized and transparent shipment tracking powered by the blockchain.
              </Text>
            </Space>
          </Col>
          <Col xs={24} md={8}>
            <Row gutter={[16, 16]}>
              <Col xs={12} sm={8}>
                <Space direction="vertical">
                  <Text strong>Quick Links</Text>
                  <Link href="#">Home</Link>
                  <Link href="#">About</Link>
                  <Link href="#">Contact</Link>
                </Space>
              </Col>
              <Col xs={12} sm={8}>
                <Space direction="vertical">
                  <Text strong>Resources</Text>
                  <Link href="#">Documentation</Link>
                  <Link href="#">API Reference</Link>
                  <Link href="#">Support</Link>
                </Space>
              </Col>
            </Row>
          </Col>
          <Col xs={24} md={8} className="text-right">
            <Space size="large">
              <Link href="#" target="_blank"><GithubOutlined className="text-xl" /></Link>
              <Link href="#" target="_blank"><TwitterOutlined className="text-xl" /></Link>
              <Link href="#" target="_blank"><LinkedinOutlined className="text-xl" /></Link>
            </Space>
          </Col>
        </Row>
        <Divider className="my-6" />
        <div className="text-center">
          <Text type="secondary" className="text-xs">
            © {new Date().getFullYear()} Pull Stackers. All rights reserved.
          </Text>
        </div>
      </div>
    </Footer>
  );
};

export default AppFooter;
