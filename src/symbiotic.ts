import { createPublicClient, erc20Abi, getContract } from "viem";

// PROTOCOL_DATA_PROVIDER
const PROTOCOL_DATA_PROVIDER = "0x1BC8FCFbE6Aa17e4A7610F51B888f34583D202Ec";
import factoryAbi from "./abis/DefaultCollateralFactory";
import defaultCollateralAbi from "./abis/DefaultCollateral";

async function getDefaultCollateralInfo(
  publicClient: ReturnType<typeof createPublicClient>,
  index: number,
  lastVersion: bigint
) {
  const defaultCollateralAddr = (await publicClient.readContract({
    address: PROTOCOL_DATA_PROVIDER,
    abi: factoryAbi,
    functionName: "entity",
    args: [BigInt(index)],
  })) as `0x${string}`;

  const version = await publicClient.readContract({
    address: defaultCollateralAddr,
    abi: defaultCollateralAbi,
    functionName: "version",
  });

  if (version !== lastVersion) {
    return null;
  }

  const name = await publicClient.readContract({
    address: defaultCollateralAddr,
    abi: defaultCollateralAbi,
    functionName: "symbol",
  });

  const assetAddr = (await publicClient.readContract({
    address: defaultCollateralAddr,
    abi: defaultCollateralAbi,
    functionName: "asset",
  })) as `0x${string}`;

  const assetSymbol = await publicClient.readContract({
    address: assetAddr,
    abi: erc20Abi,
    functionName: "symbol",
  });

  return {
    name,
    address: defaultCollateralAddr,
    tokenSymbol: assetSymbol,
    tokenAddress: assetAddr,
  };
}

export default {
  getProtocolData: async (
    publicClient: ReturnType<typeof createPublicClient>
  ) => {
    const totalEntities = await publicClient.readContract({
      address: PROTOCOL_DATA_PROVIDER,
      abi: factoryAbi,
      functionName: "totalEntities",
    });

    const lastVersion = await publicClient.readContract({
      address: PROTOCOL_DATA_PROVIDER,
      abi: factoryAbi,
      functionName: "lastVersion",
    });

    const result = [];
    for (let i = 0; i < totalEntities; i++) {
      const info = getDefaultCollateralInfo(publicClient, i, lastVersion);
      if (info) result.push(info);
    }
    return await Promise.all(result);
  },
};
