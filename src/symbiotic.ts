import { createPublicClient, getContract } from "viem";

// PROTOCOL_DATA_PROVIDER
const PROTOCOL_DATA_PROVIDER = "0x1BC8FCFbE6Aa17e4A7610F51B888f34583D202Ec";
import factoryAbi from "./abis/DefaultCollateralFactory";
import defaultCollateralAbi from "./abis/DefaultCollateral";

export default {
  getProtocolData: async (
    publicClient: ReturnType<typeof createPublicClient>,
  ) => {
    const factory = getContract({
      address: PROTOCOL_DATA_PROVIDER,
      abi: factoryAbi,
      client: publicClient,
    });

    const totalEntities = (await factory.read.totalEntities()) as number;

    const result = [];
    for (let i = 0; i < totalEntities; i++) {
      result.push(
        (async () => {
          const defaultCollateralAddr = await factory.read.entity([i]);

          const defaultCollateral = getContract({
            address: defaultCollateralAddr as `0x${string}`,
            abi: defaultCollateralAbi,
            client: publicClient,
          });
          const name = await defaultCollateral.read.symbol();
          const assetAddr = await defaultCollateral.read.asset();
          const assetContract = getContract({
            address: assetAddr as `0x${string}`,
            abi: [
              {
                inputs: [],
                name: "symbol",
                outputs: [{ internalType: "string", name: "", type: "string" }],
                stateMutability: "view",
                type: "function",
              },
            ] as const,
            client: publicClient,
          });
          const assetSymbol = await assetContract.read.symbol();
          return {
            name,
            address: defaultCollateralAddr,
            token: {
              symbol: assetSymbol,
              address: assetAddr,
            },
          };
        })(),
      );
    }
    return await Promise.all(result);
  },
};
