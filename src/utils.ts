import { createPublicClient, http } from "viem";
import { arbitrum, mainnet } from "viem/chains";
import fs from "fs";
import path from "path";

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

export function ensureFilePathExists(filePath: string) {
  const dirname = path.dirname(filePath);

  if (!fs.existsSync(dirname)) {
    fs.mkdirSync(dirname, { recursive: true });
  }
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, "");
  }
}

export function dumpOjectToFile(o: Object, filePath: string) {
  // Convert the result to a JSON string with indentation
  const jsonString = JSON.stringify(o, null, 4);

  // Remove quotes around keys using a regex
  const formatedString = jsonString.replace(/"([^"]+)":/g, "$1:");

  // Add the prefix and suffix
  const res = `// This file is auto-generated. Do not edit!\n\nexport default ${formatedString} as const`;

  // Write to the file
  filePath = "out/" + filePath + ".ts";
  ensureFilePathExists(filePath);
  fs.writeFileSync(filePath, res);
}
