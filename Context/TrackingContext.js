import React, { useState, useEffect, useCallback } from "react";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
// INTERNAL IMPORT
import tracking from "./Tracking.json";

// --- CONFIGURATION START ---
// Select your network: 'localhost' or 'polygon_amoy'
const NETWORK = "localhost";

const CONFIG = {
  localhost: {
    address: "0x5FbDB2315678afecb367f032d93F642f64180aa3", // Update after "npx hardhat run scripts/deploy.js --network localhost"
    rpcUrl: undefined, // Web3Modal/MetaMask usually handles this, or use http://127.0.0.1:8545 for read-only
  },
  polygon_amoy: {
    address: "YOUR_POLYGON_AMOY_CONTRACT_ADDRESS", // Update after deploying to Polygon Amoy
    rpcUrl: "https://rpc-amoy.polygon.technology/",
  },
};

const ContractAddress = CONFIG[NETWORK].address;
const ContractABI = tracking.abi;
// --- CONFIGURATION END ---

// FETCHING SMART CONTRACT
const fetchContract = (signerOrProvider) =>
  new ethers.Contract(ContractAddress, ContractABI, signerOrProvider);

export const TrackingContext = React.createContext();

export const TrackingProvider = ({ children }) => {
  // STATE VARIABLE
  const DappName = "Product Tracking Dapp";
  const [currentUser, setCurrentUser] = useState("");

  const createShipment = useCallback(async (items) => {
    console.log(items);
    const { receiver, pickupTime, distance, price } = items;
    try {
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = fetchContract(signer);
      const createItem = await contract.createShipment(
        receiver,
        new Date(pickupTime).getTime(),
        distance,
        ethers.utils.parseUnits(price, 18),
        {
          value: ethers.utils.parseUnits(price, 18),
        }
      );

      await createItem.wait();
      console.log("Shipment created successfully");
    } catch (error) {
      console.log("Something went wrong", error);
    }
  }, []);

  const getAllShipments = useCallback(async () => {
    try {
      // Logic to switch provider based on configuration
      let provider;
      if (NETWORK === "localhost") {
        // For local hardhat, we can often just use JsonRpcProvider without args if on default port
        // Or if we are in browser, we might rely on window.ethereum if connected,
        // but here it seems the pattern is to read from a specific RPC for "read-only" data.
        provider = new ethers.providers.JsonRpcProvider();
      } else {
        provider = new ethers.providers.JsonRpcProvider(CONFIG[NETWORK].rpcUrl);
      }

      const contract = fetchContract(provider);
      const shipments = await contract.getAllTransactions();
      console.log(shipments);
      const allShipments = shipments.map((shipment) => ({
        sender: shipment.sender,
        receiver: shipment.receiver,
        price: ethers.utils.formatEther(shipment.price.toString()),
        pickupTime: shipment.pickupTime.toNumber(),
        deliveryTime: shipment.deliveryTime.toNumber(),
        distance: shipment.distance.toNumber(),
        isPaid: shipment.isPaid,
        status: shipment.status,
      }));
      return allShipments;
    } catch (error) {
      console.log("Error while getting shipments", error);
    }
  }, []);

  const getShipmentsCount = useCallback(async () => {
    try {
      if (!window.ethereum) return "Install MetaMask";
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });

      let provider;
      if (NETWORK === "localhost") {
        provider = new ethers.providers.JsonRpcProvider();
      } else {
        provider = new ethers.providers.JsonRpcProvider(CONFIG[NETWORK].rpcUrl);
      }

      const contract = fetchContract(provider);
      const shipmentsCount = await contract.getShipmentsCount(accounts[0]);
      return shipmentsCount.toNumber();
    } catch (error) {
      console.log("Error while getting shipment count", error);
    }
  }, []);

  const completeShipment = useCallback(async (completeShip) => {
    console.log(completeShip);
    const { receiver, index } = completeShip;
    try {
      if (!window.ethereum) return "Install MetaMask";
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = fetchContract(signer);

      const transaction = await contract.completeShipment(
        accounts[0],
        receiver,
        index,
        {
          gasLimit: 300000,
        }
      );
      transaction.wait();
      console.log("Shipment completed successfully", transaction);
    } catch (error) {
      console.log("Error while completing shipment", error);
    }
  }, []);

  const getShipment = useCallback(async (index) => {
    console.log(index);
    try {
      if (!window.ethereum) return "Install MetaMask";
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });

      let provider;
      if (NETWORK === "localhost") {
        provider = new ethers.providers.JsonRpcProvider();
      } else {
        provider = new ethers.providers.JsonRpcProvider(CONFIG[NETWORK].rpcUrl);
      }

      const contract = fetchContract(provider);
      const shipment = await contract.getShipment(accounts[0], index);
      const singleShipment = {
        sender: shipment[0],
        receiver: shipment[1],
        pickupTime: shipment[2].toNumber(),
        deliveryTime: shipment[3].toNumber(),
        distance: shipment[4].toNumber(),
        price: ethers.utils.formatEther(shipment[5].toString()),
        status: shipment[6],
        isPaid: shipment[7],
      };

      return singleShipment;
    } catch (error) {
      console.log("Error while getting shipment", error);
    }
  }, []);

  const startShipment = useCallback(async (getProduct) => {
    const { receiver, index } = getProduct;
    try {
      if (!window.ethereum) return "Install MetaMask";
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = fetchContract(signer);
      const shipment = await contract.startShipment(
        accounts[0],
        receiver,
        index
      );
      await shipment.wait();
      console.log("Shipment started successfully", shipment);
    } catch (error) {
      console.log("Error while starting shipment", error);
    }
  }, []);

  // CHECK WALLET CONNECTED
  const checkIfWalletConnected = useCallback(async () => {
    try {
      if (!window.ethereum) return "Install MetaMask";
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });
      if (accounts.length) {
        setCurrentUser(accounts[0]);
      } else {
        return "No account found";
      }
    } catch (error) {
      console.log("Error while checking wallet connection", error);
    }
  }, []);

  // CONNECT WALLET FUNCTION
  const connectWallet = useCallback(async () => {
    try {
      if (!window.ethereum) return "Install MetaMask";
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setCurrentUser(accounts[0]);
    } catch (error) {
      console.log("Something went wrong while connecting wallet", error);
    }
  }, []);

  useEffect(() => {
    checkIfWalletConnected();
  }, [checkIfWalletConnected]);

  return (
    <TrackingContext.Provider
      value={{
        connectWallet,
        createShipment,
        getAllShipments,
        completeShipment,
        getShipment,
        startShipment,
        getShipmentsCount,
        DappName,
        currentUser,
      }}
    >
      {children}
    </TrackingContext.Provider>
  );
};
