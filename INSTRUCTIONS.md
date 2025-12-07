# Supply Chain DApp Deployment Guide

This guide explains how to run the DApp locally and deploy it to the **Polygon Amoy Testnet** with frontend on **Vercel**. Includes CI/CD automation.

---

## Prerequisites

- Node.js installed (v20 recommended)
- MetaMask extension installed
- MATIC tokens for Polygon Amoy testnet
- Vercel account
- GitHub repository with Secrets configured

---

## 1. Local Development (Hardhat Network)

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Start Local Blockchain

```bash
npx hardhat node
```

This starts a blockchain at `http://127.0.0.1:8545/` and lists accounts with private keys.

### Step 3: Deploy Smart Contract Locally

```bash
npx hardhat run scripts/deploy.js --network localhost
```

Copy the deployed address (e.g., `0x5FbDB2315678afecb367f032d93F642f64180aa3`).

### Step 4: Configure Frontend

Edit `Context/TrackingContext.js`:

```javascript
const NETWORK = "localhost";

const CONFIG = {
  localhost: {
    address: "PASTE_YOUR_LOCAL_ADDRESS_HERE",
    rpcUrl: "http://127.0.0.1:8545",
    chainId: 31337,
  },
  polygon_amoy: {
    address:
      process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ||
      "0x0000000000000000000000000000000000000000",
    rpcUrl:
      process.env.NEXT_PUBLIC_RPC_URL || "https://rpc-amoy.polygon.technology/",
    chainId: 80002,
  },
};

export const ACTIVE_CONFIG = CONFIG[NETWORK];
```

### Step 5: Start Frontend

```bash
npm run dev
```

Open `http://localhost:3000` in browser.

### Step 6: Configure MetaMask

- Network: `Localhost 8545`
- RPC URL: `http://127.0.0.1:8545`
- Chain ID: `31337`
- Import an account from Hardhat node private keys.

---

## 2. Polygon Amoy Testnet Deployment

### Step 1: Set Environment Variables

Create a `.env` in root:

```env
PRIVATE_KEY="your_metamask_private_key_here"
POLYGON_AMOY_RPC="https://rpc-amoy.polygon.technology/"
```

### Step 2: Fund Wallet

Use a testnet faucet to get MATIC:

- [Polygon Faucet](https://faucet.polygon.technology/)

### Step 3: Deploy Contract

```bash
npx hardhat run scripts/deploy.js --network polygon_amoy
```

Copy the deployed contract address.

### Step 4: Configure Frontend

Edit `Context/TrackingContext.js`:

```javascript
const NETWORK = "polygon_amoy";

const CONFIG = {
  polygon_amoy: {
    address: "PASTE_YOUR_POLYGON_ADDRESS_HERE",
    rpcUrl: process.env.NEXT_PUBLIC_RPC_URL || "https://rpc-amoy.polygon.technology/",
    chainId: 80002,
  },
  localhost: { ... } // keep local config
};

export const ACTIVE_CONFIG = CONFIG[NETWORK];
```

### Step 5: Start Frontend

```bash
npm run dev
```

Switch MetaMask to **Polygon Amoy Testnet** (Chain ID: 80002).

---

## 3. Frontend Deployment to Vercel

### Option A: Vercel Dashboard

1. Push code to GitHub.
2. Import repository in Vercel.
3. Configure:

   - Framework: Next.js
   - Root: `./`

4. Environment variables:

| Name                           | Value                                  |
| ------------------------------ | -------------------------------------- |
| `NEXT_PUBLIC_NETWORK`          | `polygon_amoy`                         |
| `NEXT_PUBLIC_CONTRACT_ADDRESS` | `0x1234...ABCD`                        |
| `NEXT_PUBLIC_RPC_URL`          | `https://rpc-amoy.polygon.technology/` |

5. Deploy.

### Option B: Vercel CLI

```bash
npm i -g vercel
vercel login
vercel --prod
```

Follow prompts; set environment variables via CLI or dashboard.

---

## 4. CI/CD with GitHub Actions

Automates contract and frontend deployment.

### Workflow: `.github/workflows/deploy.yml`

```yaml
name: Deploy Polygon & Vercel

on:
  push:
    branches:
      - deploy

jobs:
  deploy-contract:
    runs-on: ubuntu-latest
    outputs:
      contract_address: ${{ steps.deploy.outputs.address }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: node-version: "20"
      - run: npm ci
      - run: npx hardhat compile
      - id: deploy
        env:
          PRIVATE_KEY: ${{ secrets.PRIVATE_KEY }}
          POLYGON_AMOY_RPC: ${{ secrets.POLYGON_AMOY_RPC }}
        run: |
          set -e
          output=$(npx hardhat run scripts/deploy.js --network polygon_amoy 2>&1)
          echo "$output"
          address=$(echo "$output" | grep -oE '0x[a-fA-F0-9]{40}' | head -n 1)
          if [ -z "$address" ]; then exit 1; fi
          echo "address=$address" >> $GITHUB_OUTPUT

  deploy-frontend:
    needs: deploy-contract
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: node-version: "20"
      - run: npm ci
      - name: Build Next.js
        env:
          NEXT_PUBLIC_NETWORK: polygon_amoy
          NEXT_PUBLIC_CONTRACT_ADDRESS: ${{ needs.deploy-contract.outputs.contract_address }}
          NEXT_PUBLIC_RPC_URL: ${{ secrets.POLYGON_AMOY_RPC }}
        run: npm run build
      - name: Deploy to Vercel
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
          VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
          VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
        run: |
          vercel deploy --prod --yes --token=${{ secrets.VERCEL_TOKEN }} \
            --env NEXT_PUBLIC_NETWORK=polygon_amoy \
            --env NEXT_PUBLIC_CONTRACT_ADDRESS=${{ needs.deploy-contract.outputs.contract_address }} \
            --env NEXT_PUBLIC_RPC_URL=${{ secrets.POLYGON_AMOY_RPC }}
```

**Secrets required**:

| Name                | Value                   |
| ------------------- | ----------------------- |
| `PRIVATE_KEY`       | Your wallet private key |
| `POLYGON_AMOY_RPC`  | Polygon Amoy RPC URL    |
| `VERCEL_TOKEN`      | Vercel access token     |
| `VERCEL_ORG_ID`     | Vercel organization ID  |
| `VERCEL_PROJECT_ID` | Vercel project ID       |

---

## 5. Verification

1. Check Vercel URL.
2. Ensure MetaMask network is Polygon Amoy.
3. Connect wallet and test shipment creation.

---

✅ Now you have:

- Local dev instructions
- Polygon Amoy deployment instructions
- Frontend deployment (Vercel)
- CI/CD workflow using GitHub Actions
- Environment variable setup for local and production
