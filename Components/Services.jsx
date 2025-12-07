import React from "react";
import { Card, Col, Row, Typography } from "antd";
import {
  ArrowRightOutlined,
  CheckCircleOutlined,
  ContainerOutlined,
  RocketOutlined,
  UserOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

const services = [
  {
    title: "Complete Shipment",
    description: "Finalize a shipment and release payment to the sender.",
    action: "setCompleteModal",
    icon: <CheckCircleOutlined className="text-3xl text-primary" />,
    color: "#52c41a", // green
  },
  {
    title: "Get Shipment Details",
    description: "Retrieve real-time details of a specific shipment.",
    action: "setGetModel",
    icon: <ContainerOutlined className="text-3xl text-primary" />,
    color: "#1677ff", // blue
  },
  {
    title: "Start a Shipment",
    description: "Begin the on-chain transit process for a new shipment.",
    action: "setStartModal",
    icon: <RocketOutlined className="text-3xl text-primary" />,
    color: "#722ed1", // purple
  },
  {
    title: "My Profile",
    description: "View your shipment history and account details.",
    action: "setOpenProfile",
    icon: <UserOutlined className="text-3xl text-primary" />,
    color: "#faad14", // gold
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
    <section className="bg-transparent">
      <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-12">
        {/* Section header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <Title level={2} style={{ marginBottom: 8, fontWeight: 700 }}>
              Shipment Actions
            </Title>
            <Text type="secondary" className="text-base">
              Quickly perform common actions on your supply chain shipments.
            </Text>
          </div>
        </div>

        <Row gutter={[24, 24]} align="stretch">
          {services.map((service) => (
            <Col xs={24} sm={12} lg={6} key={service.title}>
              <Card
                hoverable
                onClick={() => actions[service.action](true)}
                className="group text-left shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border-0"
                style={{ 
                  borderRadius: 16, 
                  height: "100%", 
                  overflow: 'hidden',
                  background: 'white'
                }}
                bodyStyle={{ padding: 24, height: "100%" }}
              >
                <div className="flex flex-col h-full justify-between">
                  <div>
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-colors duration-300 group-hover:bg-opacity-20"
                      style={{ background: `${service.color}15` }} // 15 is approx 10% opacity hex
                    >
                      {React.cloneElement(service.icon, { style: { color: service.color } })}
                    </div>
                    
                    <Title
                      level={4}
                      className="!mb-3 !font-bold text-gray-800"
                    >
                      {service.title}
                    </Title>
                    <Text type="secondary" className="text-sm leading-relaxed block mb-4">
                      {service.description}
                    </Text>
                  </div>

                  <div className="flex items-center text-primary font-medium group-hover:gap-2 transition-all duration-300">
                    <span style={{ color: service.color }}>Action</span>
                    <ArrowRightOutlined style={{ color: service.color }} />
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </section>
  );
};

export default Services;
