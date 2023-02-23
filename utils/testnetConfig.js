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
      tag: "v1",
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
      tag: "v1",
    },
  ],
};

module.exports = {
  harborConfig,
};
