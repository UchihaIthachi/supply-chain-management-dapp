// components/AppFooter.jsx
import React from "react";
import { Layout, Row, Col, Typography, Space } from "antd";

const { Footer } = Layout;
const { Text } = Typography;

const AppFooter = () => {
  return (
    <Footer style={{ backgroundColor: "#f9fafb", padding: "32px 16px 20px" }}>
      <div className="max-w-screen-xl mx-auto">
        <Row justify="space-between" align="middle" gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Space align="center">
              <img
                src="/logo.png"
                alt="Pull Stackers Logo"
                style={{ width: 140, height: "auto" }}
              />
              <div>
                <Text strong>Blockchain Supply Chain DApp</Text>
                <br />
                <Text type="secondary" style={{ fontSize: 12 }}>
                  Transparent shipment tracking powered by smart contracts.
                </Text>
              </div>
            </Space>
          </Col>

          <Col xs={24} md={12}>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 16,
                textAlign: "right",
              }}
            >
              {/* Placeholder for future links / socials */}
              {/* <a href="#" style={{ fontSize: 13 }}>Docs</a>
              <a href="#" style={{ fontSize: 13 }}>GitHub</a> */}
            </div>
          </Col>
        </Row>

        <div
          style={{
            marginTop: 24,
            paddingTop: 16,
            borderTop: "1px solid #e5e7eb",
            textAlign: "center",
          }}
        >
          <Text type="secondary" style={{ fontSize: 12 }}>
            © 2024 Pull Stackers. All rights reserved.
          </Text>
        </div>
      </div>
    </Footer>
  );
};

export default AppFooter;
