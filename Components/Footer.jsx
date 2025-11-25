import React from "react";
import { Layout, Row, Col, Typography, Space, Divider } from "antd";
import {
  GithubOutlined,
  TwitterOutlined,
  LinkedinOutlined,
} from "@ant-design/icons";

const { Footer } = Layout;
const { Text, Link } = Typography;

const AppFooter = () => {
  const year = new Date().getFullYear();

  return (
    <Footer className="bg-white border-t border-gray-200 px-4 py-8">
      <div className="max-w-screen-xl mx-auto">
        <Row gutter={[24, 32]} justify="space-between" align="top">
          {/* Brand + tagline */}
          <Col xs={24} md={8}>
            <Space direction="vertical" size={8}>
              <Space align="center">
                {/* <img src="/logo.png" alt="Logo" className="h-6" /> */}
                <Text strong className="text-base">
                  Supply Chain DApp
                </Text>
              </Space>
              <Text type="secondary" className="text-sm">
                Decentralized and transparent shipment tracking powered by the
                blockchain.
              </Text>
            </Space>
          </Col>

          {/* Links */}
          <Col xs={24} md={10}>
            <Row gutter={[24, 16]}>
              <Col xs={12} sm={8}>
                <Space direction="vertical" size={4}>
                  <Text strong>Quick Links</Text>
                  <Link href="#">Home</Link>
                  <Link href="#">About</Link>
                  <Link href="#">Contact</Link>
                </Space>
              </Col>
              <Col xs={12} sm={8}>
                <Space direction="vertical" size={4}>
                  <Text strong>Resources</Text>
                  <Link href="#">Documentation</Link>
                  <Link href="#">API Reference</Link>
                  <Link href="#">Support</Link>
                </Space>
              </Col>
            </Row>
          </Col>

          {/* Socials */}
          <Col xs={24} md={6} className="md:text-right text-left">
            <Space
              direction="vertical"
              size={8}
              className="w-full md:items-end items-start"
            >
              <Text strong>Follow us</Text>
              <Space size="large">
                <Link href="#" target="_blank" aria-label="GitHub">
                  <GithubOutlined className="text-xl" />
                </Link>
                <Link href="#" target="_blank" aria-label="Twitter / X">
                  <TwitterOutlined className="text-xl" />
                </Link>
                <Link href="#" target="_blank" aria-label="LinkedIn">
                  <LinkedinOutlined className="text-xl" />
                </Link>
              </Space>
            </Space>
          </Col>
        </Row>

        <Divider className="my-6" />

        <div className="text-center">
          <Text type="secondary" className="text-xs">
            © {year} Pull Stackers. All rights reserved.
          </Text>
        </div>
      </div>
    </Footer>
  );
};

export default AppFooter;
