import React ,{ useState, useEffect, useCallback, useContext} from "react";
// module.exports = {
//     plugins: [
//       require('autoprefixer'),
//       // add other PostCSS plugins here if needed
//     ],
//   };
//internal import
import{
    NavBar,
    Table,
    Form,
    Profile,
    CompleteShipment,
    GetShipment,
    StartShipment,
} from "../Components/index.js";
import {TrackingContext} from "../Context/TrackingContext";

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
    // DATA STATE VARIABLE
    const [allShipmentsdata, setallShipmentsdata] = useState();

    useEffect(() => {
        const getCampaignsData = getAllShipments();

        const fetchData = async () => {
            const allData = await getCampaignsData;
            setallShipmentsdata(allData);
        };

        fetchData();
    }, [getAllShipments]);

    return (
        <>
            <NavBar />
            <Table
                setCreateShipmentModel={setCreateShipmentModel}
                allShipmentsdata={allShipmentsdata}
            />
            <Form
                createShipmentModel={createShipmentModel}
                createShipment={createShipment}
                setCreateShipmentModel={setCreateShipmentModel}
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
            />
        </>
    );
};

export default Index;
