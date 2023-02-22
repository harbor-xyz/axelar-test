# Prerequisites

To follow this test, you'll need the following tools installed on your machine:

- Git (https://git-scm.com/)
- Node.js (https://nodejs.org/)

# Getting started

1. You need to add the credentials in the `test/test-cross-chain-call.test.js`, which consist of the `userKey` and the `projectKey`. To get your user key, [follow this tutorial](/docs/Tutorials/manage_credentials#getting-user-key). To get your project key, [follow this tutorial](/docs/Tutorials/manage_credentials#managing-project-key).

It should look like this:

```javascript
harbor = new Harbor({
  userKey: "cFeJWnDwQFVTSF2AabM2W5",
  projectKey: "fPMeKGPUfyBTCoq2omv3G4",
});
```

The above keys are for demonstration only. They don't actually work! Also, the Harbor SDK does not support parallel test execution, yet. But this is coming soon!

2. Set the testnet name value in the `test/test-cross-chain-call.test.js` file. You can do this by updating the `TESTNET_NAME` variable to a unique name of your choice. For example:

```bash
let TESTNET_NAME = ""
```

3. Install the project dependencies by running the following command:

```bash
yarn install
```

4. Finally, compile the contracts:

```bash
rm -rf artifacts && npx hardhat compile
```

# Overview of contracts

You will be looking at two contracts, one on the Ethereum blockchain and another on the Polygon blockchain. [The Ethereum contract](https://github.com/harbor-xyz/axelar-test/blob/master/contracts/ethereum_contracts/MessageSender.sol) will act as the message sender while [the Polygon contract](https://github.com/harbor-xyz/axelar-test/blob/master/contracts/polygon_contracts/MessageReceiver.sol) will act as the message receiver.

You can read the contracts in-depth if you'd like to learn more about them.

# Testing

The test is located in the `test/test-cross-chain-call.test.js`. Open it and follow along!

## Axelar Testnet configuration

Before you move on to running the tests, you need to know how you are applying the Axelar Testnet configuration that contains the 2 custom contracts.

<!-- Add the configuration link to explain more -->

The variable `harborConfig` contains the JSON:

```typescript
const harborConfig = {
  bridges: [
    {
      name: "AXELAR",
      chains: ["ethereum", "polygon"],
    },
  ],
  chains: [
    {
      chain: "ethereum",
      config: {
        artifactsPath: "./artifacts/",
        deploy: {
          scripts: "./deploy/ethereum",
        },
        environment: {
          AXL_GATEWAY_ADDR: "$axl_gateway_addr",
          AXL_GAS_RECEIVER_ADDR: "$axl_gasReceiver_addr",
        },
      },
      tag: "v7",
    },
    {
      chain: "polygon",
      config: {
        artifactsPath: "./artifacts",
        deploy: {
          scripts: "./deploy/polygon",
        },
        environment: {
          AXL_GATEWAY_ADDR: "$axl_gateway_addr",
          AXL_GAS_RECEIVER_ADDR: "$axl_gasReceiver_addr",
        },
      },
      tag: "v7",
    },
  ],
};
```

This Testnet configuration contains two important attributes, `bridges` and `chains`:

- In `bridges`, you specify the `name` of bridge that you are applying along with the array of `chains` that you'd like to include in the bridge
- In `chains`, you configure each separate chain further with it's own artifacts and deployment scripts.
  - You must specify the `AXL_GATEWAY_ADDR` and `AXL_GAS_RECEIVER_ADDR` in the `environment` attribute.
    - This is because both contracts needs these arguments in it's constructor, otherwise they won't work with the Axelar protocol
  - Both their values `$axl_gateway_addr` and `$axl_gasReceiver_addr` are automatically filled by Harbor whilst it applies the Testnet

:::info [READ MORE ABOUT THE CONFIGURATION FILE HERE](/docs/configuration/config_file)
:::

### Running the tests

To execute the test, tun the following command in your terminal:

```bash
yarn jest test/test-cross-chain-call.test.js
```

As explained above, this test applies the Axelar configuration with the custom contracts, checks for the chains / off-chain actors existence on the Testnet while also executing and asserting the cross-chain transaction from Ethereum to Polygon.

## Overview of tests

### Check if the Testnet is up with the right chains and off chain actors

After you apply the Testnet in the `beforeAll` function, you must check that the testnet, the chains and the off-chain actor (just the relayer) exist!

### Check if the cross-chain message passing works

Next, you need to prove that the cross-chain message passing works. Your Ethereum contract, `MessageSender`, needs to send a message. After that transaction is made, the attribute `value()` is expected to change to the new message in the contract `MessageReceiver` on Polygon. Asserting that the `MessageReceiver`'s `value` equals to the `MESSAGE` variable that was set in the test is enough to prove that the cross-chain transaction worked!

