# Blockchain Supply Chain Management DApp

A decentralized application (DApp) for **tracking shipments on the blockchain** from creation to completion.

This project demonstrates how blockchain can be used to bring **transparency, auditability, and automation** into supply-chain workflows. Shipment lifecycle changes are driven by a smart contract, and every update is recorded on-chain, making it tamper-evident and easily verifiable by all participants.

---

## 🚀 Key Features

- **On-chain shipment lifecycle**  
  Create, start, and complete shipments directly via a Solidity smart contract.

- **End-to-end visibility**  
  View all shipments and their statuses in a web dashboard, including per-user shipments and a global transaction log.

- **Trustless state transitions**  
  The contract enforces valid state changes (for example, from pending → in transit → delivered), rejecting invalid transitions.

- **Wallet-based access**  
  Users interact with the DApp through an EVM wallet (MetaMask), with transactions signed in the browser.

- **Local & testnet workflows**  
  Develop quickly on a local Hardhat network, then deploy the same contract to Polygon Amoy.

- **CI/CD for contracts & frontend**  
  GitHub Actions automate contract deployment to Polygon Amoy and frontend deployment to Vercel.

---

## 🧰 Tech Stack

- **Frontend:** Next.js, React, Tailwind CSS  
- **Web3:** Ethers.js, Web3Modal, MetaMask  
- **Smart Contracts & Tooling:** Solidity, Hardhat  
- **Networks:**
  - **Local development:** Hardhat node (`http://127.0.0.1:8545`)
  - **Remote test:** Polygon Amoy testnet
- **CI/CD & Hosting:** GitHub Actions, Vercel

---

## 🧱 Smart Contract Overview

The core of the system is a `Tracking` contract that models shipments and exposes query + lifecycle functions.

At a high level, each **shipment** stores:

- `sender` / `receiver` addresses  
- `pickupTime` and `deliveryTime` (UNIX timestamps)  
- `distance` and `price` (numeric values)  
- `status` enum (e.g. pending, in transit, delivered)  
- `isPaid` flag to track payment state

The contract maintains:

- A mapping from a user address to an **array of shipments**, allowing you to fetch shipments associated with a particular creator.
- A **global array** used as a flat transaction log, which can be returned in a single call for dashboards and analytics.

Key behaviors include:

- Creating a shipment with validation on payment and parameters.
- Starting a shipment (transition to “in transit”) under valid conditions.
- Completing a shipment (transition to “delivered”) and updating timestamps, payment flags, and events.

> For the full contract logic, see `contracts/Tracking.sol`.

---

## 📊 System & Architecture (High-Level)

The DApp follows a standard Web3 architecture:

1. **Next.js / React UI**  
   Renders pages and components for creating, viewing, and updating shipments.

2. **Web3 Context Layer**  
   A context module (for example, `Context/TrackingContext.js`) centralizes:
   - Contract connection (address + ABI)
   - Read calls (e.g. fetch shipments)
   - Write actions (e.g. create/start/complete shipment)
   - Wallet connection and account state

3. **Wallet (MetaMask)**  
   Handles account selection and transaction signing. The frontend talks to MetaMask via Web3Modal/Ethers.js.

4. **Blockchain Network**  
   - **Local:** Hardhat node for fast development and testing.  
   - **Remote:** Polygon Amoy for a realistic testnet deployment.

5. **CI/CD Pipeline**  
   GitHub Actions compile and deploy the contract, then deploy the frontend with the corresponding contract address configured.

---

## 🚀 Deployment (Polygon Amoy + Vercel)

This repository is wired with a pipeline that supports:

- Deploying the `Tracking` contract to **Polygon Amoy**
- Updating the frontend configuration with the **new contract address**
- Deploying the Next.js app to **Vercel**

For full details (environment variables, secrets, and workflow breakdown), refer to:

> 📄 **[INSTRUCTIONS.md](./INSTRUCTIONS.md)**

---

## 🛠️ Local Development Setup

### 1. Clone the repository

```bash
git clone https://github.com/Uchihaithachi/supply-chain-management-dapp.git
cd supply-chain-management-dapp
````

### 2. Install dependencies

```bash
npm install
```

This installs both the frontend and Hardhat tooling as defined in `package.json`.

---

## ⛓️ Local Blockchain & Contract Deployment

### 3. Compile the contract (optional but recommended)

```bash
npx hardhat compile
```

### 4. Start a local Hardhat node

In **Terminal 1**:

```bash
npx hardhat node
```

This launches a local node at:

```text
http://127.0.0.1:8545
```

You’ll see a list of test accounts with private keys in the console output.

### 5. Deploy the contract to localhost

In **Terminal 2** (same project directory):

```bash
npx hardhat run --network localhost scripts/deploy.js
```

You should see output like:

```text
Tracking deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
```

Copy this **contract address** for the frontend configuration.

---

## 🌐 Frontend Configuration & Run

### 6. Configure the contract address

If you are using a Web3 context file such as:

* `Context/TrackingContext.js`

update the constant that holds your contract address:

```js
const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
```

Make sure this matches the address printed by the Hardhat deployment step.

### 7. Start the Next.js dev server

```bash
npm run dev
```

By default, the app is served at:

```text
http://localhost:3000
```

---

## 🦊 MetaMask Configuration (Localhost)

1. Open **MetaMask**.

2. Add a new custom network if needed:

   * **Network Name:** Localhost 8545
   * **RPC URL:** `http://127.0.0.1:8545`
   * **Chain ID:** `31337`
   * **Currency Symbol:** ETH (optional)

3. Import one of the private keys printed by `npx hardhat node`.

4. Open `http://localhost:3000` and click **Connect Wallet**.

5. Use the UI to:

   * Create a new shipment
   * Mark it as started / in transit
   * Mark it as delivered

---

## 🧪 Testing (Optional)

The project can include Hardhat tests (e.g. `test/Tracking.js`) to validate:

* Initial deployment state (e.g. shipment counter)
* Shipment creation and associated events
* Reverts on invalid payments or state transitions
* Status updates from pending → in transit → delivered
* Correct updates to flags like `isPaid`

Run tests with:

```bash
npx hardhat test
```

---

## 📂 Project Structure (High-Level)

```text
.
├── Components/         # React UI components (NavBar, forms, tables, modals)
├── Context/            # Web3 context (contract connection, methods, state)
├── contracts/          # Solidity contracts (Tracking.sol)
├── scripts/            # Hardhat deployment scripts
├── test/               # Contract tests (Hardhat / Mocha / Chai)
├── pages/              # Next.js pages (_app.js, index.js)
├── public/             # Static assets
├── styles/             # Global styles (Tailwind, etc.)
├── .github/workflows/  # CI/CD pipelines (Amoy deployment, Vercel)
├── INSTRUCTIONS.md     # Detailed deployment and configuration guide
├── hardhat.config.js   # Hardhat network and compiler config
└── package.json        # Dependencies and NPM scripts
```

---

## ✅ Possible Extensions

* Listen to **contract events** on the frontend for real-time updates without manual refresh.
* Introduce **role-aware flows** (e.g. stricter rules for who can start/complete a shipment).
* Add **analytics views** (e.g. shipments by status, user, or time).
* Extend CI/CD to support **multiple environments** (dev, staging, prod) with separate contracts.
