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
    icon: <CheckCircleOutlined className="text-2xl text-primary" />,
  },
  {
    title: "Get Shipment Details",
    description: "Retrieve real-time details of a specific shipment.",
    action: "setGetModel",
    icon: <ContainerOutlined className="text-2xl text-primary" />,
  },
  {
    title: "Start a Shipment",
    description: "Begin the on-chain transit process for a new shipment.",
    action: "setStartModal",
    icon: <RocketOutlined className="text-2xl text-primary" />,
  },
  {
    title: "My Profile",
    description: "View your shipment history and account details.",
    action: "setOpenProfile",
    icon: <UserOutlined className="text-2xl text-primary" />,
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
        {/* Section header (optional, matches other sections) */}
        <div className="flex items-end justify-between mb-6">
          <div>
            <Title level={3} style={{ marginBottom: 4 }}>
              Shipment Actions
            </Title>
            <Text type="secondary">
              Quickly perform common actions on your shipments.
            </Text>
          </div>
        </div>

        <Row gutter={[24, 24]} align="stretch">
          {services.map((service) => (
            <Col xs={24} sm={12} lg={6} key={service.title}>
              <Card
                hoverable
                onClick={() => actions[service.action](true)}
                className="group text-left shadow-card transition-all hover:shadow-card-hover hover:-translate-y-1"
                style={{ borderRadius: 12, height: "100%" }}
                bodyStyle={{ padding: 18, height: "100%" }}
              >
                <div className="flex flex-col h-full">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <Title
                        level={5}
                        className="!mb-2 !font-semibold"
                        style={{ marginBottom: 4 }}
                      >
                        {service.title}
                      </Title>
                      <Text type="secondary" className="text-sm">
                        {service.description}
                      </Text>
                    </div>
                    {service.icon}
                  </div>

                  <div className="mt-4 flex justify-end">
                    <ArrowRightOutlined className="opacity-0 group-hover:opacity-100 transition-opacity" />
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
