import React, { useState, useEffect, useContext } from "react";
// internal import
import {
  NavBar,
  Table,
  Form,
  Services,
  Profile,
  CompleteShipment,
  GetShipment,
  StartShipment,
} from "../Components/index.js";
import { TrackingContext } from "../Context/TrackingContext";

const Index = () => {
  const {
    currentUser,
    createShipment,
    getAllShipments,
    completeShipment,
    getShipment,
    startShipment,
    getShipmentsCount,
  } = useContext(TrackingContext);

  // STATE VARIABLE
  const [createShipmentModel, setCreateShipmentModel] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const [startModal, setStartModal] = useState(false);
  const [completeModal, setCompleteModal] = useState(false);
  const [getModel, setGetModel] = useState(false);
  const [loading, setLoading] = useState(true);
  // DATA STATE VARIABLE
  const [allShipmentsdata, setallShipmentsdata] = useState([]);

  // Derive unique addresses for autocomplete
  const uniqueAddresses = [
    ...new Set(
      allShipmentsdata?.flatMap((s) => [s.sender, s.receiver]) || []
    ),
  ].filter(Boolean);

  const fetchData = React.useCallback(async () => {
    setLoading(true);
    try {
      const allData = await getAllShipments();
      setallShipmentsdata(allData);
    } catch (error) {
      console.error("Failed to fetch shipments:", error);
    }
    setLoading(false);
  }, [getAllShipments]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <>
      <Services
        setOpenProfile={setOpenProfile}
        setCompleteModal={setCompleteModal}
        setGetModel={setGetModel}
        setStartModal={setStartModal}
      />
      <Table
        setCreateShipmentModel={setCreateShipmentModel}
        allShipmentsdata={allShipmentsdata}
        loading={loading}
        onRefresh={fetchData}
      />
      <Form
        createShipmentModel={createShipmentModel}
        createShipment={createShipment}
        setCreateShipmentModel={setCreateShipmentModel}
        uniqueAddresses={uniqueAddresses}
      />
      <Profile
        openProfile={openProfile}
        setOpenProfile={setOpenProfile}
        currentUser={currentUser}
        getShipmentsCount={getShipmentsCount}
      />
      <CompleteShipment
        completeModal={completeModal}
        setCompleteModal={setCompleteModal}
        completeShipment={completeShipment}
        uniqueAddresses={uniqueAddresses}
      />
      <GetShipment
        getModel={getModel}
        setGetModel={setGetModel}
        getShipment={getShipment}
      />
      <StartShipment
        startModal={startModal}
        setStartModal={setStartModal}
        startShipment={startShipment}
        uniqueAddresses={uniqueAddresses}
      />
    </>
  );
};

export default Index;
