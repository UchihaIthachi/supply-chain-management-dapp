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
    address: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    rpcUrl: "http://127.0.0.1:8545",
  },
  polygon_amoy: {
    address: "YOUR_POLYGON_AMOY_CONTRACT_ADDRESS",
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
  const DappName = "Product Tracking Dapp";
  const [currentUser, setCurrentUser] = useState("");

  // Helper: return an injected provider if available
  const getInjectedProvider = () => {
    if (typeof window !== "undefined" && window.ethereum) {
      return window.ethereum;
    }
    return null;
  };

  // Helper: create a read-only provider (explicit url for reliability)
  const createReadOnlyProvider = () => {
    const rpc = CONFIG[NETWORK].rpcUrl || "http://127.0.0.1:8545";
    return new ethers.providers.JsonRpcProvider(rpc);
  };

  // Helper: get a signer (injected or via Web3Modal). Returns { provider, signer }
  // Replace your existing getProviderAndSigner with this
  const getProviderAndSigner = async (forceConnect = false) => {
    try {
      const injected = getInjectedProvider();

      if (injected) {
        const provider = new ethers.providers.Web3Provider(injected, "any");

        // quick silent check (don't prompt) unless forceConnect
        if (!forceConnect) {
          try {
            const accounts = await provider.send("eth_accounts", []);
            if (accounts && accounts.length > 0) {
              return { provider, signer: provider.getSigner(), accounts };
            }
          } catch (silentErr) {
            // ignore silent check errors, we'll try to request accounts below
            console.warn("silent eth_accounts check failed:", silentErr);
          }
        }

        // prompt injected wallet directly (avoid Web3Modal.selectExtension)
        try {
          const accounts = await provider.send("eth_requestAccounts", []);
          return { provider, signer: provider.getSigner(), accounts };
        } catch (reqErr) {
          // If user rejects or wallet errors, surface full error
          console.error(
            "eth_requestAccounts failed on injected provider:",
            reqErr
          );
          throw reqErr;
        }
      }

      // No injected provider -> try Web3Modal (this is where selectExtension may throw)
      try {
        const web3Modal = new Web3Modal({
          cacheProvider: false /*, providerOptions: {...} */,
        });
        const connection = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(connection, "any");
        const accounts = await provider.send("eth_requestAccounts", []);
        return { provider, signer: provider.getSigner(), accounts };
      } catch (web3ModalErr) {
        // LOG the full Web3Modal/provider error object so we can debug "selectExtension" failures
        console.error(
          "Web3Modal connect error (selectExtension likely):",
          web3ModalErr
        );
        // Try final fallback: explicitly check window.ethereum again before giving up
        const finalInjected = getInjectedProvider();
        if (finalInjected) {
          try {
            const fallbackProvider = new ethers.providers.Web3Provider(
              finalInjected,
              "any"
            );
            const accounts = await fallbackProvider.send(
              "eth_requestAccounts",
              []
            );
            return {
              provider: fallbackProvider,
              signer: fallbackProvider.getSigner(),
              accounts,
            };
          } catch (fallbackErr) {
            console.error("Fallback eth_requestAccounts failed:", fallbackErr);
          }
        }
        // rethrow original error so caller can show UI message
        throw web3ModalErr;
      }
    } catch (err) {
      // final logging: show everything we know (code, message, stack, toString)
      console.error("getProviderAndSigner final error:", {
        name: err?.name,
        message: err?.message,
        code: err?.code,
        stack: err?.stack,
        toString: String(err),
        full: err,
      });
      throw err;
    }
  };

  // ----------------- Actions -----------------

  const createShipment = useCallback(async (items) => {
    console.log("createShipment payload:", items);
    const { receiver, pickupTime, distance, price } = items;
    try {
      const { signer } = await getProviderAndSigner(true); // ensure user is prompted
      if (!signer)
        throw new Error("No signer available. Install/unlock wallet.");
      const contract = fetchContract(signer);

      // parse price safely (expect price to be a string like "0.01")
      const value = ethers.utils.parseEther(price.toString());

      const tx = await contract.createShipment(
        receiver,
        Math.floor(new Date(pickupTime).getTime()),
        Number(distance),
        value,
        { value } // if contract expects value
      );

      const receipt = await tx.wait();
      console.log("Shipment created successfully, receipt:", receipt);
      return receipt;
    } catch (error) {
      console.error("createShipment error:", error);
      // Surface friendly message for UI if desired
      throw error;
    }
  }, []);

  const getAllShipments = useCallback(async () => {
    try {
      const provider = createReadOnlyProvider();
      const contract = fetchContract(provider);
      const shipments = await contract.getAllTransactions();
      console.log("raw shipments:", shipments);
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
      console.error("getAllShipments error:", error);
      throw error;
    }
  }, []);

  const getShipmentsCount = useCallback(async () => {
    try {
      const injected = getInjectedProvider();
      if (!injected) return 0;
      const provider = new ethers.providers.Web3Provider(injected, "any");
      const accounts = await provider.send("eth_accounts", []);
      if (!accounts || accounts.length === 0) return 0;
      const contract = fetchContract(createReadOnlyProvider());
      const shipmentsCountBN = await contract.getShipmentsCount(accounts[0]);
      return shipmentsCountBN.toNumber();
    } catch (error) {
      console.error("getShipmentsCount error:", error);
      throw error;
    }
  }, []);

  const completeShipment = useCallback(async (completeShip) => {
    console.log("completeShipment payload:", completeShip);
    const { receiver, index } = completeShip;
    try {
      const { signer, accounts } = await getProviderAndSigner(true);
      if (!signer) throw new Error("No signer available.");
      const caller = accounts && accounts[0];
      const contract = fetchContract(signer);
      const tx = await contract.completeShipment(caller, receiver, index, {
        gasLimit: 300000,
      });
      const receipt = await tx.wait();
      console.log("Shipment completed successfully:", receipt);
      return receipt;
    } catch (error) {
      console.error("completeShipment error:", error);
      throw error;
    }
  }, []);

  const getShipment = useCallback(async (index) => {
    console.log("getShipment index:", index);
    try {
      const injected = getInjectedProvider();
      if (!injected) return null;
      const provider = new ethers.providers.Web3Provider(injected, "any");
      const accounts = await provider.send("eth_accounts", []);
      if (!accounts || accounts.length === 0) return null;
      const contract = fetchContract(createReadOnlyProvider());
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
      console.error("getShipment error:", error);
      throw error;
    }
  }, []);

  const startShipment = useCallback(async (getProduct) => {
    console.log("startShipment payload:", getProduct);
    const { receiver, index } = getProduct;
    try {
      const { signer, accounts } = await getProviderAndSigner(true);
      if (!signer) throw new Error("No signer available.");
      const caller = accounts && accounts[0];
      const contract = fetchContract(signer);
      const tx = await contract.startShipment(caller, receiver, index);
      const receipt = await tx.wait();
      console.log("Shipment started successfully:", receipt);
      return receipt;
    } catch (error) {
      console.error("startShipment error:", error);
      throw error;
    }
  }, []);

  // CHECK WALLET CONNECTED
  const checkIfWalletConnected = useCallback(async () => {
    try {
      const injected = getInjectedProvider();
      if (!injected) {
        console.info("No injected wallet found (MetaMask).");
        setCurrentUser("");
        return;
      }
      const provider = new ethers.providers.Web3Provider(injected, "any");
      const accounts = await provider.send("eth_accounts", []);
      if (accounts && accounts.length) {
        setCurrentUser(accounts[0]);
      } else {
        setCurrentUser("");
      }
    } catch (error) {
      console.error("checkIfWalletConnected error:", error);
      setCurrentUser("");
    }
  }, []);

  // CONNECT WALLET FUNCTION
  const connectWallet = useCallback(async () => {
    try {
      if (typeof window === "undefined" || !window.ethereum) {
        console.warn("No injected wallet found (MetaMask).");
        return "Install MetaMask";
      }

      const injectedProvider = window.ethereum;
      const provider = new ethers.providers.Web3Provider(
        injectedProvider,
        "any"
      );

      // Prompt user to connect (this calls MetaMask directly; no selectExtension)
      const accounts = await provider.send("eth_requestAccounts", []);
      if (accounts && accounts.length > 0) {
        setCurrentUser(accounts[0]);
        console.log("Connected account:", accounts[0]);
        return accounts[0];
      } else {
        console.warn("No accounts returned by wallet.");
        return null;
      }
    } catch (err) {
      console.error("connectWallet (injected) error:", err);
      // handle user-rejected code (4001) if needed
      return null;
    }
  }, []);

  useEffect(() => {
    checkIfWalletConnected();

    // Optional: listen for account/network changes and update state
    const onAccountsChanged = (accounts) => {
      console.log("accountsChanged:", accounts);
      if (accounts && accounts.length) setCurrentUser(accounts[0]);
      else setCurrentUser("");
    };
    const onChainChanged = (chainId) => {
      console.log("chainChanged:", chainId);
      // You may want to reload or check network here
    };

    if (typeof window !== "undefined" && window.ethereum) {
      window.ethereum.on?.("accountsChanged", onAccountsChanged);
      window.ethereum.on?.("chainChanged", onChainChanged);
    }

    return () => {
      if (typeof window !== "undefined" && window.ethereum) {
        window.ethereum.removeListener?.("accountsChanged", onAccountsChanged);
        window.ethereum.removeListener?.("chainChanged", onChainChanged);
      }
    };
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
