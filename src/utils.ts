import { createPublicClient, http } from "viem";
import { arbitrum, mainnet } from "viem/chains";
import fs from "fs";

export const arb1Client = createPublicClient({
  batch: { multicall: true },
  chain: arbitrum,
  transport: http("https://arbitrum.llamarpc.com/"),
});

export const mainnetClient = createPublicClient({
  batch: { multicall: true },
  chain: mainnet,
  transport: http("https://eth.llamarpc.com/"),
});

export function dumpOjectToFile(o: Object, fileName: string) {
  // Convert the result to a JSON string with indentation
  const jsonString = JSON.stringify(o, null, 4);

  // Remove quotes around keys using a regex
  const formatedString = jsonString.replace(/"([^"]+)":/g, "$1:");

  // Add the prefix and suffix
  const res = `// This file is auto-generated. Do not edit!\n\nexport default ${formatedString} as const`;

  // Write to the file
  fs.writeFileSync("out/_" + fileName + "Info.ts", res);
}
