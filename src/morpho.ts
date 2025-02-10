import { createPublicClient, getContract } from "viem";
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
        liquidity {
          usd
        }
      }
    }
  }
`;

const variables = {
  orderBy: "TotalAssetsUsd",
  first: 30,
};

async function fetchData() {
  try {
    const data = await request(endpoint, query, variables);
    console.log(JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

export default {
  getProtocolData: async (
    publicClient: ReturnType<typeof createPublicClient>,
  ) => {
    return result;
  },
};
