# Protocol Scripting

This project contains scripts and tools for interacting with blockchain protocols.
## Objective

The main objective of this repository is to automatically generate a custom version of the `{protocol}Info.ts` file required for the Defi-kit repository managed by karpatkey. This is necessary because some private repositories are included in their requirements.

## Getting Started

### Prerequisites

- Node.js
- pnpm

### Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/hopperlabsxyz/protocol-scripting.git
cd protocol-scripting
```

### Install Dependencies

To install the necessary dependencies using pnpm, run:

```bash
pnpm i
```

### Generate Scripts

To generate the required scripts (aave v3 on arbitrum for now), run:

```bash
pnpm generate
```

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

