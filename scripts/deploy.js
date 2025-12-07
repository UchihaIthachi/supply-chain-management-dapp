const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with:", deployer.address);
  const Tracking = await hre.ethers.getContractFactory("Tracking");
  const tracking = await Tracking.deploy();

  await tracking.deployed();
  console.log(`Tracking deployed to ${tracking.address}`);

  // const Tracking = await hre.ethers.getContractFactory("Tracking");
  // const tracking = await Tracking.deploy(); // Added 'await' and corrected syntax
  // await tracking.deployed();
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
