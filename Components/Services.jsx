import React from "react";
import images from "../Images/index"
import { Row, Col, Card } from 'antd';

export default ({
  setOpenProfile,
  setCompleteModal,
  setGetModel,
  setStartModal,
}) => {
  const team = [
    {
      avatar: images.compShipment,
      key: 1,
      title: "Complete Shipment"
    },
    {
      avatar: images.getShipment,
      key: 2,
      title: "Get Shipment"
    },
    {
      avatar: images.startShipment,
      key: 3,
      title: "Start Shipment"
    },
    {
      avatar: images.userProfile,
      key: 4,
      title: "User Profile"
    },
  ];

  const openModalBox = (text) => {
    if (text === 1) {
      setCompleteModal(true);
    } else if (text === 2) {
      setGetModel(true);
    } else if (text === 3) {
      setStartModal(true);
    } else if (text === 4) {
      setOpenProfile(true);
    }
  };

  return (
    <section className="py-5">
      <div className="max-w-screen-xl mx-auto px-4 md:px-8">
        <Row gutter={[32, 32]}>
          {team.map((item, i) => (
            <Col xs={24} sm={12} md={8} lg={6} key={i}>
              <Card
                hoverable
                cover={
                  <div style={{ height: 200, position: 'relative', overflow: 'hidden' }}>
                     <img
                      src={item.avatar.src || item.avatar}
                      alt={item.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                     />
                  </div>
                }
                onClick={() => openModalBox(item.key)}
                bodyStyle={{ padding: '12px', textAlign: 'center' }}
              >
                <Card.Meta title={item.title} />
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </section>
  );
};
