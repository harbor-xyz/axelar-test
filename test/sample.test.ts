import Harbor from "@harbor-xyz/harbor";
import {
  Account,
  Balance,
  Contract,
  Chain,
  Log,
  OffChainActor,
  Testnet,
} from "@harbor-xyz/harbor/dist/harbor_sdk/types";
import { expect } from "chai";

describe("Harbor Test E2E", function () {
  jest.setTimeout(1200000);

  let harbor: Harbor;
  let testnet: Testnet;
  const testnetName: string = "axelar-testnet";

  beforeAll(async () => {
    harbor = new Harbor({
      userKey: "wyBXi3jEHSYXnqBKosoJH3",
      projectKey: "56JusKMRhQ4a6mUfL5QGAP",
    });
    await harbor.authenticate();
    if (typeof testnetName === "string") {
      testnet = await harbor.testnet(testnetName);
    }
  });

  it("Checks if the Testnet exists", async () => {
    console.log("\n\n==========testnet==========");
    console.log(testnet.name);

    expect(testnet.status).to.equal("RUNNING");
  });

  it("Checks if the Chains exists", async () => {
    const chains = testnet.chains();
    console.log(`\n\n==========chains(${chains.length})==========`);

    chains.forEach((chain) => {
      console.log("Chain: " + chain.chain);
      console.log("Endpoint: " + chain.endpoint);
      expect(chain.status).to.equal("RUNNING");
      //console.log(`${chain.chain} - ${chain.id} - ${chain.status} - ${chain.endpoint}`);
    });
  });

  it("Checks if the Offchain actors exists", async function () {
    const offChainActors = testnet.offChainActors();
    console.log(
      `\n\n==========offChainActors(${offChainActors.length})==========`
    );
    offChainActors.forEach((actor) => {
      console.log("Off-chian actor: " + actor.name);
      console.log("Endpoint: " + actor.endpoint);
      expect(actor.status).to.equal("RUNNING");
      //console.log(`${actor.name} - ${actor.status} - ${actor.ports()} - ${actor.endpoint}`);
    });
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
    const ethereumContracts = await ethereum.contracts();
    let exists = false;
    ethereumContracts.forEach((contract) => {
      if (contract.name == "Greeter") {
        exists = true;
      }
    });
    expect(exists).to.equal(true);
  });

  it("Restart Axelar node", async function () {
    console.log("Stopping axelarNode");
    testnet = await harbor.stop(testnet.name, "axelarNode");
    let offChainActors = testnet.offChainActors();
    offChainActors.forEach((actor) => {
      if (actor.name == "axelarNode") {
        console.log(`${actor.name} - ${actor.status}`);
        expect(actor.status).to.equal("STOPPED");
      }
    });
    console.log("Starting axelarNode");
    testnet = await harbor.start(testnet.name, "axelarNode");
    offChainActors = testnet.offChainActors();
    offChainActors.forEach((actor) => {
      if (actor.name == "axelarNode") {
        console.log(
          `${actor.name} - ${actor.status} - ${actor.ports()} - ${
            actor.endpoint
          }`
        );
        expect(actor.status).to.equal("RUNNING");
      }
    });
  });

  it("Assert and print chain logs", async function () {
    if (typeof testnetName === "string") {
      testnet = await harbor.testnet(testnetName);
      const chains = testnet.chains();
      let success = false;
      chains.forEach(async (chain) => {
        if (chain.chain == "ethereum") {
          await chain.logs().then((logs) => {
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
        }
      });

      expect(success).to.equal(true);
    }
  });
});
