import { createPublicClient, http } from "viem";
import { arbitrum, mainnet } from "viem/chains";
import fs from "fs";

export const arb1Client = createPublicClient({
  batch: { multicall: true },
  chain: arbitrum,
  transport: http(),
});

export const mainnetClient = createPublicClient({
  batch: { multicall: true },
  chain: mainnet,
  transport: http(),
});

export function dumpOjectToFile(
  o: Object,
  directoryPath: string,
  fileName: string,
) {
  // Convert the result to a JSON string with indentation
  const jsonString = JSON.stringify(o, null, 4);

  // Remove quotes around keys using a regex
  const formatedString = jsonString.replace(/"([^"]+)":/g, "$1:");

  // Add the prefix and suffix
  const res = `// This file is auto-generated. Do not edit!\n\nexport default ${formatedString} as const`;

  directoryPath = `out/${directoryPath}`;

  // Create directory if it does not exist
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath);
  }
  // Write to the file
  fs.writeFileSync(`${directoryPath}/${fileName}Info.ts`, res);
}
