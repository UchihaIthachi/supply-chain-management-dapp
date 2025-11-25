import React from "react";
import { Card, Col, Row, Typography } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const services = [
  {
    title: "Complete Shipment",
    description: "Finalize a shipment and release payment to the sender.",
    action: "setCompleteModal",
  },
  {
    title: "Get Shipment Details",
    description: "Retrieve real-time details of a specific shipment.",
    action: "setGetModel",
  },
  {
    title: "Start a Shipment",
    description: "Begin the on-chain transit process for a new shipment.",
    action: "setStartModal",
  },
  {
    title: "My Profile",
    description: "View your shipment history and account details.",
    action: "setOpenProfile",
  },
];

const Services = ({
  setOpenProfile,
  setCompleteModal,
  setGetModel,
  setStartModal,
}) => {
  const actions = {
    setOpenProfile,
    setCompleteModal,
    setGetModel,
    setStartModal,
  };

  return (
    <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-12">
      <Row gutter={[24, 24]}>
        {services.map((service, i) => (
          <Col xs={24} sm={12} lg={6} key={i}>
            <Card
              hoverable
              className="group text-left shadow-lg transition-all hover:border-black"
              onClick={() => actions[service.action](true)}
              style={{ borderRadius: "8px" }}
            >
              <Title level={5} className="!mb-2 !font-semibold">
                {service.title}
              </Title>
              <Text type="secondary" className="text-sm">
                {service.description}
              </Text>
              <div className="mt-4">
                <ArrowRightOutlined className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Services;
