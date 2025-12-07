const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with:", deployer.address);

  // Check balance
  const balance = await deployer.getBalance();
  console.log("Account balance:", hre.ethers.utils.formatEther(balance));

  if (balance.eq(0)) {
    console.error("Error: The deployment account has 0 funds.");
    console.error("Please fund your wallet with Polygon Amoy MATIC.");
    console.error(
      "You can use a faucet like: https://faucet.polygon.technology/"
    );
    process.exit(1);
  }

  const Tracking = await hre.ethers.getContractFactory("Tracking");
  const tracking = await Tracking.deploy();
  await tracking.deployed();
  console.log("Tracking deployed to:", tracking.address);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
