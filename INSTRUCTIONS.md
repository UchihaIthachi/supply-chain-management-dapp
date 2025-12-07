# Deployment Instructions

This guide covers how to run the Supply Chain DApp locally and how to deploy it to the Polygon Amoy Testnet.

## Prerequisites

- Node.js installed
- MetaMask wallet extension installed in your browser

## 1. Local Development (Hardhat Network)

This is the fastest way to develop and test the application.

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Start the Local Blockchain

Open a terminal and run:

```bash
npx hardhat node
```

This will start a local blockchain at `http://127.0.0.1:8545/` and list 20 accounts with their private keys. **Keep this terminal open.**

### Step 3: Deploy Smart Contract

Open a **second terminal** and run:

```bash
npx hardhat run scripts/deploy.js --network localhost
```

Copy the deployed address from the output (e.g., `0x5FbDB...`).

### Step 4: Configure Frontend

Open `Context/TrackingContext.js` and:

1.  Find the `CONFIG` object at the top of the file.
2.  Update the `address` field inside the `localhost` section:
    ```javascript
    const CONFIG = {
      localhost: {
        address: "PASTE_YOUR_LOCAL_ADDRESS_HERE",
        // ...
      },
      // ...
    };
    ```
3.  Ensure the `NETWORK` variable is set to `'localhost'`:
    ```javascript
    const NETWORK = "localhost";
    ```

### Step 5: Start Frontend

In the second terminal, run:

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

### Step 6: Configure MetaMask

1.  Open MetaMask -> Settings -> Networks -> Add Network -> Add a network manually.
2.  **Network Name:** Localhost 8545
3.  **RPC URL:** `http://127.0.0.1:8545`
4.  **Chain ID:** `31337`
5.  **Currency Symbol:** ETH
6.  Import an Account: Copy a private key from the "Start the Local Blockchain" terminal and import it into MetaMask.

---

## 2. Polygon Amoy Testnet Deployment

Follow these steps to deploy your contract to the live Polygon Amoy Testnet.

### Step 1: Setup Environment Variables

1.  Create a file named `.env` in the root directory.
2.  Add your Polygon Amoy RPC URL and your Wallet Private Key (do not share this file!):
    ```env
    POLYGON_AMOY_RPC="https://rpc-amoy.polygon.technology/"
    PRIVATE_KEY="your_wallet_private_key_here"
    ```
    _Note: You can get a free RPC URL from providers like Alchemy or Infura for better stability._

### Step 2: Get Testnet MATIC

You need MATIC tokens to pay for gas fees.

1.  Go to a Polygon Amoy Faucet (e.g., [Polygon Faucet](https://faucet.polygon.technology/)).
2.  Paste your wallet address and request MATIC.

### Step 3: Deploy to Polygon Amoy

Run the following command:

```bash
npx hardhat run scripts/deploy.js --network polygon_amoy
```

Wait for the deployment to finish and copy the **Contract Address**.

### Step 4: Configure Frontend for Polygon

Open `Context/TrackingContext.js` and:

1.  Find the `CONFIG` object at the top of the file.
2.  Update the `address` field inside the `polygon_amoy` section:
    ```javascript
    const CONFIG = {
      // ...
      polygon_amoy: {
        address: "PASTE_YOUR_POLYGON_ADDRESS_HERE",
        rpcUrl: "https://rpc-amoy.polygon.technology/",
      },
    };
    ```
3.  Change the `NETWORK` variable to `'polygon_amoy'`:
    ```javascript
    const NETWORK = "polygon_amoy";
    ```

### Step 5: Run the Frontend

```bash
npm run dev
```

Ensure your MetaMask is connected to the **Polygon Amoy Testnet** (Chain ID: 80002).
