import { createPublicClient, getContract } from "viem";

// PROTOCOL_DATA_PROVIDER
//TODO: Update the PROTOCOL_DATA_PROVIDER with the correct address for morpho
const PROTOCOL_DATA_PROVIDER = "0x4881Ef0BF6d2365D3dd6499ccd7532bcdBCE0658"; //this is the address for metaMorpho
import abi from "./abis/IPoolAddressesProvider";

export default {
  getProtocolData: async (
    publicClient: ReturnType<typeof createPublicClient>,
  ) => {
    // 1. Create contract instance
    const contract = getContract({
      address: PROTOCOL_DATA_PROVIDER,
      abi,
      client: publicClient,
    });

    // 2. call getAllReservesTokens
    const reservesTokens = await contract.read.getAllReservesTokens();

    const result = await Promise.all(
      reservesTokens.map(async (reserveToken) => {
        // 3. for each reserve token, get the Config Data
        const configDataRaw = await contract.read.getReserveConfigurationData([
          reserveToken.tokenAddress,
        ]);

        // 4. get the Tokens Addresses
        const tokenAddressRaw = await contract.read.getReserveTokensAddresses([
          reserveToken.tokenAddress,
        ]);

        const reserveData = {
          symbol: reserveToken.symbol,
          token: reserveToken.tokenAddress,

          usageAsCollateralEnabled: configDataRaw[5],
          borrowingEnabled: configDataRaw[6],
          stableBorrowRateEnabled: configDataRaw[7],
          isActive: configDataRaw[8],
          isFrozen: configDataRaw[9],

          aTokenAddress: tokenAddressRaw[0],
          // stableDebtTokenAddress: tokenAddressRaw[1],
          variableDebtTokenAddress: tokenAddressRaw[2],
        };

        return reserveData;
      }),
    );
    return result;
  },
};
