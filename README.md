# Axelar Harbor test

## Overview

Harbor has successfully cloned Axelar onto one of our Testnets. The `test/sample.test.ts` runs tests against this cloned Axelar bridge. The tests go over the following: 

- Checking if the Testnet exist
- Checking if the Chains exist
- Checking if the Offchain actors exists
- Stopping and starting the Axelar node
- Asserts and prints Ethereum's chain logs

## Set up
Install the packages with your favourite package manager:

```bash
# npm
npm install

# yarn
yarn install
```

## Running the tests
After installing the packages, you can execute the test, by running:

```bash
yarn jest
```