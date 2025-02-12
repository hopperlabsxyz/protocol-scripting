import { createPublicClient } from "viem";
import { request, gql } from "graphql-request";

const endpoint = "https://blue-api.morpho.org/graphql";

const query = gql`
  query Query($where: VaultFilters, $orderBy: VaultOrderBy, $first: Int) {
    vaults(where: $where, orderBy: $orderBy, first: $first) {
      items {
        address
        asset {
          address
          symbol
        }
        name
        symbol
      }
    }
  }
`;

const variables = {
  orderBy: "TotalAssetsUsd",
  first: 30,
  where: {
    whitelisted: true,
  },
};

async function fetchVaults() {
  try {
    return await request(endpoint, query, variables);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

export default {
  getProtocolData: async (
    publicClient: ReturnType<typeof createPublicClient>,
  ) => {
    const data = await fetchVaults();
    return (data as any).vaults.items;
  },
};
