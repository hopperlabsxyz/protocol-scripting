# MetaMorpho Pools Query Guide

This guide explains how to fetch MetaMorpho pool information using The Graph API.

## Overview
MetaMorpho pools can be queried from the official Morpho GraphQL endpoint: `https://blue-api.morpho.org/graphql`

## Query Structure
The following GraphQL query fetches whitelisted vaults with total assets over $1M:

```graphql
query ExampleQuery($first: Int, $where: VaultFilters, $orderBy: VaultOrderBy) {
    vaults(first: $first, where: $where, orderBy: $orderBy) {
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
```

### Query Variables
```json
{
    "where": {
        "whitelisted": true,
        "totalAssetsUsd_gte": 1000000
    },
    "orderBy": "TotalAssets"
}
```

## Response Data
The query returns:
- Vault addresses
- Underlying asset details (address and symbol)
- Vault name
- Vault symbol

## Usage
You can use this query in any GraphQL client or directly in the GraphQL playground at the provided endpoint.