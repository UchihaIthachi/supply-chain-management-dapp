import React from "react";
import { Layout, Row, Col, Typography } from "antd";

const { Footer } = Layout;
const { Text } = Typography;

export default () => {
  return (
    <Footer style={{ backgroundColor: '#f0f2f5', padding: '40px 20px' }}>
      <div className="max-w-screen-xl mx-auto">
        <Row justify="space-between" align="middle">
          <Col xs={24} sm={12}>
             <img src="logo.png" alt="Logo" style={{ width: 150 }} />
             <div style={{ marginTop: 10 }}>
                 <Text type="secondary">
                     Blockchain Supply Chain Management DApp
                 </Text>
             </div>
          </Col>
          <Col xs={24} sm={12} style={{ textAlign: 'right' }}>
             {/* Add social links or other footer links here if needed */}
          </Col>
        </Row>
        <div style={{ marginTop: 40, textAlign: 'center', borderTop: '1px solid #d9d9d9', paddingTop: 20 }}>
            <Text type="secondary">© 2024 Pull Stackers. All rights reserved.</Text>
        </div>
      </div>
    </Footer>
  );
};
