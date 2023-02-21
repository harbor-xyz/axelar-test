import Harbor from "@harbor-xyz/harbor";
import { Testnet } from "@harbor-xyz/harbor/dist/harbor_sdk/types";
import { expect } from "chai";

describe("Harbor Test E2E", function () {
  jest.setTimeout(1200000);

  let harbor: Harbor;
  let testnet: Testnet;
  const testnetName: string = "axelar-testnet";

  beforeAll(async () => {
    // add your userKey and projectKey here!
    harbor = new Harbor({
      userKey: "",
      projectKey: "",
    });
    await harbor.authenticate();
    if (typeof testnetName === "string") {
      testnet = await harbor.clone("protocol-Axelar", testnetName);
    }
  });

  it("Checks if the Testnet exists", async () => {
    console.log("\n\n==========testnet==========");
    console.log(testnet.name);

    expect(testnet.status).to.equal("RUNNING");
  });

  it("Checks if ethereum and polygon exist", async () => {
    const ethereum = testnet.ethereum;
    const polygon = testnet.polygon;
    expect(ethereum.status).to.equal("RUNNING");
    expect(polygon.status).to.equal("RUNNING");
  });

  it("Checks if the Offchain actors exists", async function () {
    const offChainActors = testnet.offChainActors();
    for (const key in offChainActors) {
      const actor = offChainActors[key];
      expect(actor.status).to.equal("RUNNING");
    }
  });

  it("Checks if the ETH balances of all Ethereum wallets are 10000 ETH", async function () {
    const ethereum = testnet.ethereum;
    const ethereumWallets = await ethereum.wallets();
    ethereumWallets.forEach((wallet) => {
      const balances = wallet.balances;
      expect(balances["ETH"]).to.equal("10000");
    });
  });

  it("Checks if the Contract Greeter exists on Ethereum", async function () {
    const ethereum = testnet.ethereum;
    const ethereumContracts = ethereum.contracts();
    let exists = false;
    for (const key in ethereumContracts) {
      const contract = ethereumContracts[key];
      if (contract.name == "Greeter") {
        exists = true;
      }
    }
    expect(exists).to.equal(true);
  });

  it("Restart Axelar node", async function () {
    console.log("Stopping axelarNode");
    testnet = await harbor.stop(testnet.name, "axelarNode");
    let offChainActors = testnet.offChainActors();
    let axelar = offChainActors["axelarNode"];
    expect(axelar.status).to.equal("STOPPED");
    console.log("Starting axelarNode");
    testnet = await harbor.start(testnet.name, "axelarNode");
    offChainActors = testnet.offChainActors();
    axelar = offChainActors["axelarNode"];
    expect(axelar.status).to.equal("RUNNING");
  });

  it("Assert and print ethereum chain logs", async function () {
    if (typeof testnetName === "string") {
      testnet = await harbor.testnet(testnetName);
      const ethereum = testnet.ethereum;
      let success = false;
      await ethereum.logs().then((logs) => {
        logs.forEach((log) => {
          if (
            log.message.includes("Deploying") ||
            log.message.includes("Deployed")
          ) {
            console.log(log);
            success = true;
          }
        });
      });

      expect(success).to.equal(true);
    }
  });
});
