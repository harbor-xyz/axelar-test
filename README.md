# Harbor Workshop

Welcome to the Harbor Workshop at Interop Summit! This workshop will guide you through the process of setting up and running a project using the Harbor SDK.

## Prerequisites

To follow this workshop, you'll need the following tools installed on your machine:

- Git (https://git-scm.com/)
- Node.js (https://nodejs.org/)

## Getting started

To get started with the workshop, follow these steps:

1. Clone the Git repository to your local machine:

   ```sh
   git clone https://github.com/harbor-xyz/workshop-interop.git
   ```

2. Set the testnet name prefix in the `utils/config.js` file. You can do this by updating the TESTNET_NAME variable to a unique name prefix of your choice. For example:

   ```javascript
        let TESTNET_NAME = ""        
   ```

3. Install the project dependencies by running the following command:
    ```
        yarn install
    ```

4. Compile the contracts
    ```
        npx hardhat compile
    ```

## Overview of Scripts 

### Scripts
- ```node scripts/applyTestnet.js ```
     the script uses the Harbor SDK to authenticate the user and create a new testnet using the defined configuration. The script then prints the status and endpoint information for both the Ethereum and Polygon chains included in the network, as well as the endpoint and logs for an off-chain actor called the "Axelar Relayer". The runHarborApply() function includes a timeout of 300,000 milliseconds (5 minutes) and catches any errors that may occur during the network creation process.

- ```node scripts/executeCrossChainCall.js ```
    This script uses the Harbor SDK to interact with smart contracts on both the Ethereum and Polygon chains. It then accesses a previously created testnet on Harbor and loads the smart contract instances for the Ethereum and Polygon chains.
    The script logs the initial value of a specific variable in the Polygon contract, updates the value by calling a function on the Ethereum contract, waits until the new value is reflected in the Polygon contract, and logs the final value.
    The script uses ethers to interact with the smart contracts and defines a sleep function to wait for a specified amount of time. The MESSAGE constant is a string that is passed from Ethereum to Polygon.


-  ```node scripts/diagnosis.js ```
    The code is a Node.js script that retrieves and prints logs for a testnet in Harbor. It connects to the Harbor SDK, authenticates with user credentials, retrieves the testnet details, and prints the Ethereum and Polygon logs for the testnet. It also prints the logs for the offchain actor relayer.


### Test 
- ```yarn jest test/test-cross-chain-call.test.js```
    The script is testing the functionality of the cross-chain message passing. The script first applies the Testnet configuration, next it asserts the existence of the chains/off-chain actors. Finally, it asserts that the transaction has been successfully made cross-chain.
    
## Troubleshooting
If you encounter any issues during the workshop, please refer to the following resources:

- The project documentation (https://docs.goharbor.com/docs)
- The Harbor SDK documentation (https://docs.goharbor.com/docs/SDK/)

If you are still unable to resolve the issue, please reach out to the workshop facilitator for assistance.

## Conclusion
Congratulations, you have completed the Harbor Interop Workshop! We hope you found this workshop informative and useful. If you have any feedback or suggestions for improvement, please let us know. Thank you for participating in our workshop!
