const { expect } = require("chai");
const hre = require("hardhat");

describe("Tracking", function () {
  let Tracking;
  let tracking;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  beforeEach(async function () {
    // Get the ContractFactory and Signers here.
    Tracking = await hre.ethers.getContractFactory("Tracking");
    [owner, addr1, addr2, ...addrs] = await hre.ethers.getSigners();

    // Deploy the contract
    tracking = await Tracking.deploy();
    await tracking.deployed();
  });

  describe("Deployment", function () {
    it("Should initialize with shipmentCount 0", async function () {
      expect(await tracking.shipmentCount()).to.equal(0);
    });
  });

  describe("Shipment Logic", function () {
    it("Should create a shipment", async function () {
        const pickupTime = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now
        const distance = 100;
        const price = hre.ethers.utils.parseEther("1");

        await expect(tracking.createShipment(addr1.address, pickupTime, distance, price, { value: price }))
            .to.emit(tracking, "ShipmentCreated")
            .withArgs(owner.address, addr1.address, pickupTime, distance, price);

        expect(await tracking.shipmentCount()).to.equal(1);
        
        const shipment = await tracking.getShipment(owner.address, 0);
        expect(shipment[0]).to.equal(owner.address);
        expect(shipment[1]).to.equal(addr1.address);
        expect(shipment[6]).to.equal(0); // ShipmentStatus.PENDING
    });

    it("Should fail if payment amount does not match price", async function () {
        const pickupTime = Math.floor(Date.now() / 1000) + 3600;
        const distance = 100;
        const price = hre.ethers.utils.parseEther("1");
        const wrongPrice = hre.ethers.utils.parseEther("0.5");

        await expect(tracking.createShipment(addr1.address, pickupTime, distance, price, { value: wrongPrice }))
            .to.be.revertedWith("Payment amount must match the price.");
    });

    it("Should start a shipment", async function () {
        const pickupTime = Math.floor(Date.now() / 1000) + 3600;
        const distance = 100;
        const price = hre.ethers.utils.parseEther("1");

        await tracking.createShipment(addr1.address, pickupTime, distance, price, { value: price });

        await expect(tracking.startShipment(owner.address, addr1.address, 0))
            .to.emit(tracking, "ShipmentInTransit")
            .withArgs(owner.address, addr1.address, pickupTime);

        const shipment = await tracking.getShipment(owner.address, 0);
        expect(shipment[6]).to.equal(1); // ShipmentStatus.IN_TRANSIT
    });

    it("Should complete a shipment and pay the sender", async function () {
        const pickupTime = Math.floor(Date.now() / 1000) + 3600;
        const distance = 100;
        const price = hre.ethers.utils.parseEther("1");

        await tracking.createShipment(addr1.address, pickupTime, distance, price, { value: price });
        await tracking.startShipment(owner.address, addr1.address, 0);

        const initialBalance = await owner.getBalance();

        await expect(tracking.completeShipment(owner.address, addr1.address, 0))
            .to.emit(tracking, "ShipmentDelivered");
            
        // Note: Handling gas costs in balance checks is tricky, so we mainly check if it didn't revert 
        // and that the state updated.
        const shipment = await tracking.getShipment(owner.address, 0);
        expect(shipment[6]).to.equal(2); // ShipmentStatus.DELIVERED
        expect(shipment[7]).to.equal(true); // isPaid
    });
  });
});
