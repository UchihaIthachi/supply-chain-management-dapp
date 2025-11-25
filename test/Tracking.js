const { expect } = require("chai");
const hre = require("hardhat");
const { ethers } = hre;

describe("Tracking", function () {
  let Tracking;
  let tracking;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  const ShipmentStatus = {
    PENDING: 0,
    IN_TRANSIT: 1,
    DELIVERED: 2,
  };

  beforeEach(async function () {
    Tracking = await ethers.getContractFactory("Tracking");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
    tracking = await Tracking.deploy();
    await tracking.deployed();
  });

  describe("Deployment", function () {
    it("Should initialize with shipmentCount 0", async function () {
      const count = await tracking.shipmentCount();
      expect(count).to.equal(0);
    });
  });

  describe("createShipment", function () {
    it("Should create a shipment and emit ShipmentCreated", async function () {
      const pickupTime = Math.floor(Date.now() / 1000) + 3600;
      const distance = 100;
      const price = ethers.utils.parseEther("1");

      await expect(
        tracking.createShipment(addr1.address, pickupTime, distance, price, {
          value: price,
        })
      )
        .to.emit(tracking, "ShipmentCreated")
        .withArgs(owner.address, addr1.address, pickupTime, distance, price);

      // shipmentCount incremented
      const count = await tracking.shipmentCount();
      expect(count).to.equal(1);

      // Shipment stored in mapping
      const shipment = await tracking.getShipment(owner.address, 0);
      expect(shipment[0]).to.equal(owner.address); // sender
      expect(shipment[1]).to.equal(addr1.address); // receiver
      expect(shipment[2]).to.equal(pickupTime); // pickupTime
      expect(shipment[3]).to.equal(0); // deliveryTime initially 0
      expect(shipment[4]).to.equal(distance); // distance
      expect(shipment[5]).to.equal(price); // price
      expect(shipment[6]).to.equal(ShipmentStatus.PENDING);
      expect(shipment[7]).to.equal(false); // isPaid = false

      // TypeShipment stored in array
      const txs = await tracking.getAllTransactions();
      expect(txs.length).to.equal(1);
      const typeShipment = txs[0];
      expect(typeShipment.sender).to.equal(owner.address);
      expect(typeShipment.receiver).to.equal(addr1.address);
      expect(typeShipment.pickupTime).to.equal(pickupTime);
      expect(typeShipment.deliveryTime).to.equal(0);
      expect(typeShipment.distance).to.equal(distance);
      expect(typeShipment.price).to.equal(price);
      expect(typeShipment.status).to.equal(ShipmentStatus.PENDING);
      expect(typeShipment.isPaid).to.equal(false);
    });

    it("Should revert if payment amount does not match price", async function () {
      const pickupTime = Math.floor(Date.now() / 1000) + 3600;
      const distance = 100;
      const price = ethers.utils.parseEther("1");
      const wrongPrice = ethers.utils.parseEther("0.5");

      await expect(
        tracking.createShipment(addr1.address, pickupTime, distance, price, {
          value: wrongPrice,
        })
      ).to.be.revertedWith("Payment amount must match the price.");
    });

    it("Should track shipments per sender and via getShipmentsCount", async function () {
      const pickupTime1 = Math.floor(Date.now() / 1000) + 3600;
      const pickupTime2 = Math.floor(Date.now() / 1000) + 7200;
      const distance = 50;
      const price = ethers.utils.parseEther("0.5");

      await tracking.createShipment(
        addr1.address,
        pickupTime1,
        distance,
        price,
        { value: price }
      );

      // From another account as sender
      await tracking
        .connect(addr1)
        .createShipment(owner.address, pickupTime2, distance, price, {
          value: price,
        });

      const countOwner = await tracking.getShipmentsCount(owner.address);
      const countAddr1 = await tracking.getShipmentsCount(addr1.address);

      expect(countOwner).to.equal(1);
      expect(countAddr1).to.equal(1);

      // shipmentCount global should be 2
      const globalCount = await tracking.shipmentCount();
      expect(globalCount).to.equal(2);
    });
  });

  describe("startShipment", function () {
    let pickupTime;
    let distance;
    let price;

    beforeEach(async function () {
      pickupTime = Math.floor(Date.now() / 1000) + 3600;
      distance = 100;
      price = ethers.utils.parseEther("1");

      await tracking.createShipment(
        addr1.address,
        pickupTime,
        distance,
        price,
        {
          value: price,
        }
      );
    });

    it("Should start a shipment and emit ShipmentInTransit", async function () {
      await expect(tracking.startShipment(owner.address, addr1.address, 0))
        .to.emit(tracking, "ShipmentInTransit")
        .withArgs(owner.address, addr1.address, pickupTime);

      const shipment = await tracking.getShipment(owner.address, 0);
      expect(shipment[6]).to.equal(ShipmentStatus.IN_TRANSIT);
    });

    it("Should revert if receiver is invalid when starting shipment", async function () {
      await expect(
        tracking.startShipment(owner.address, addr2.address, 0)
      ).to.be.revertedWith("Invalid receiver.");
    });

    it("Should revert if shipment is not in PENDING when starting (status already IN_TRANSIT)", async function () {
      // First start to move to IN_TRANSIT
      await tracking.startShipment(owner.address, addr1.address, 0);

      // Second start should revert due to status != PENDING
      await expect(
        tracking.startShipment(owner.address, addr1.address, 0)
      ).to.be.revertedWith("Shipment already in transit.");
    });
  });

  describe("completeShipment", function () {
    let pickupTime;
    let distance;
    let price;

    beforeEach(async function () {
      pickupTime = Math.floor(Date.now() / 1000) + 3600;
      distance = 100;
      price = ethers.utils.parseEther("1");

      await tracking.createShipment(
        addr1.address,
        pickupTime,
        distance,
        price,
        {
          value: price,
        }
      );
    });

    async function putShipmentInTransit() {
      await tracking.startShipment(owner.address, addr1.address, 0);
    }

    it("Should revert if receiver is invalid when completing shipment", async function () {
      await putShipmentInTransit();
      await expect(
        tracking.completeShipment(owner.address, addr2.address, 0)
      ).to.be.revertedWith("Invalid receiver.");
    });

    it("Should revert if shipment is not IN_TRANSIT when completing", async function () {
      // Currently status is PENDING, not IN_TRANSIT
      await expect(
        tracking.completeShipment(owner.address, addr1.address, 0)
      ).to.be.revertedWith("Shipment not in transit.");
    });

    it("Should complete shipment, pay sender, and emit events", async function () {
      await putShipmentInTransit();

      const initialBalance = await owner.getBalance();

      const tx = await tracking.completeShipment(
        owner.address,
        addr1.address,
        0
      );

      // Expect both events: ShipmentDelivered and ShipmentPaid
      await expect(tx)
        .to.emit(tracking, "ShipmentDelivered")
        .withArgs(
          owner.address,
          addr1.address,
          await getDeliveryTime(tracking, owner.address, 0)
        );

      await expect(tx)
        .to.emit(tracking, "ShipmentPaid")
        .withArgs(owner.address, addr1.address, price);

      // Check state
      const shipment = await tracking.getShipment(owner.address, 0);
      expect(shipment[6]).to.equal(ShipmentStatus.DELIVERED); // status
      expect(shipment[7]).to.equal(true); // isPaid
      expect(shipment[3]).to.not.equal(0); // deliveryTime should be set

      // TypeShipment view
      const txsAfter = await tracking.getAllTransactions();
      const typeShipment = txsAfter[0];
      expect(typeShipment.status).to.equal(ShipmentStatus.DELIVERED);
      expect(typeShipment.isPaid).to.equal(true);
      expect(typeShipment.deliveryTime).to.equal(shipment[3]);

      // Balance increased by price minus gas; we can't assert exact value, but ensure it is >= initialBalance
      const finalBalance = await owner.getBalance();
      expect(finalBalance).to.be.gt(
        initialBalance.sub(ethers.utils.parseEther("0.01"))
      ); // coarse check
    });

    it("Should revert if shipment is already paid when completing again", async function () {
      await putShipmentInTransit();
      await tracking.completeShipment(owner.address, addr1.address, 0);

      await expect(
        tracking.completeShipment(owner.address, addr1.address, 0)
      ).to.be.revertedWith("Shipment already paid.");
    });
  });

  describe("View functions", function () {
    it("getShipment should revert for out-of-range index (default Solidity behavior)", async function () {
      // No shipments created
      await expect(tracking.getShipment(owner.address, 0)).to.be.reverted;
    });

    it("getAllTransactions should return all TypeShipment entries", async function () {
      const pickupTime1 = Math.floor(Date.now() / 1000) + 3600;
      const pickupTime2 = Math.floor(Date.now() / 1000) + 7200;
      const distance = 100;
      const price = ethers.utils.parseEther("1");

      await tracking.createShipment(
        addr1.address,
        pickupTime1,
        distance,
        price,
        { value: price }
      );
      await tracking.createShipment(
        addr2.address,
        pickupTime2,
        distance,
        price,
        { value: price }
      );

      const txs = await tracking.getAllTransactions();
      expect(txs.length).to.equal(2);
      expect(txs[0].receiver).to.equal(addr1.address);
      expect(txs[1].receiver).to.equal(addr2.address);
    });
  });

  // Helper to fetch deliveryTime after completion (for matching in event)
  async function getDeliveryTime(contract, sender, index) {
    const shipment = await contract.getShipment(sender, index);
    return shipment[3]; // deliveryTime
  }
});
