import { createPublicClient, http } from "viem";
import { arbitrum, mainnet } from "viem/chains";
import fs from "fs";

export const arb1Client = createPublicClient({
  chain: arbitrum,
  transport: http(),
});

export const mainnetClient = createPublicClient({
  chain: mainnet,
  transport: http(),
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
