import aave from "./aave";
import { arb1Client, dumpOjectToFile } from "./utils";

(async function main() {
  dumpOjectToFile(await aave.getProtocolData(arb1Client), "arb1");
})()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
