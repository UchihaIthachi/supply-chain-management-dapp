import { useState } from "react";
import { Modal, Input, Button, Descriptions, Tag, message } from "antd";

export default function ShipmentDetails({ getModel, setGetModel, getShipment }) {
  const [index, setIndex] = useState("");
  const [singleShipmentData, setSingleShipmentData] = useState(null);
  const [loading, setLoading] = useState(false);

  const getShipmentData = async () => {
    if (!index) return;
    setLoading(true);
    try {
      const getData = await getShipment(index);
      setSingleShipmentData(getData);
      console.log(getData);
    } catch (error) {
      console.error("Error fetching shipment data:", error);
      message.error("Could not find shipment with that ID");
      setSingleShipmentData(null);
    } finally {
        setLoading(false);
    }
  };

  const convertTime = (time) => {
    const newTime = new Date(time);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(newTime);
  };

  const getStatusTag = (status) => {
      let color = 'geekblue';
      let text = 'PENDING';
      if (status == 1) {
          color = 'orange';
          text = 'IN TRANSIT';
      } else if (status == 2) {
          color = 'green';
          text = 'DELIVERED';
      }
      return <Tag color={color}>{text}</Tag>;
  }

  return (
    <Modal
      title="Product Tracking Details"
      open={getModel}
      onCancel={() => {
          setGetModel(false);
          setSingleShipmentData(null);
          setIndex("");
      }}
      footer={null}
      destroyOnClose
    >
        <div className="space-y-4">
            <div className="flex gap-2">
                <Input
                    placeholder="Enter Shipment ID"
                    type="number"
                    value={index}
                    onChange={(e) => setIndex(e.target.value)}
                    onPressEnter={getShipmentData}
                />
                <Button
                  type="primary"
                  onClick={getShipmentData}
                  loading={loading}
                  style={{ backgroundColor: 'black', borderColor: 'black' }}
                >
                    Get Details
                </Button>
            </div>

            {singleShipmentData && (
                <Descriptions column={1} bordered size="small">
                    <Descriptions.Item label="Sender">
                        {singleShipmentData.sender.slice(0, 25)}...
                    </Descriptions.Item>
                    <Descriptions.Item label="Receiver">
                        {singleShipmentData.receiver.slice(0, 25)}...
                    </Descriptions.Item>
                    <Descriptions.Item label="Pickup Time">
                        {convertTime(singleShipmentData.pickupTime)}
                    </Descriptions.Item>
                    <Descriptions.Item label="Delivery Time">
                        {convertTime(singleShipmentData.deliveryTime)}
                    </Descriptions.Item>
                    <Descriptions.Item label="Distance">
                        {singleShipmentData.distance} Km
                    </Descriptions.Item>
                    <Descriptions.Item label="Price">
                        {singleShipmentData.price} ETH
                    </Descriptions.Item>
                    <Descriptions.Item label="Status">
                        {getStatusTag(singleShipmentData.status)}
                    </Descriptions.Item>
                    <Descriptions.Item label="Payment Status">
                        <Tag color={singleShipmentData.isPaid ? 'green' : 'red'}>
                            {singleShipmentData.isPaid ? "Completed" : "Not Complete"}
                        </Tag>
                    </Descriptions.Item>
                </Descriptions>
            )}
        </div>
    </Modal>
  );
}
