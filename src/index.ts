import aave from "./aave.ts";
import symbiotic from "./symbiotic.ts";
import morpho from "./morpho.ts";
import { arb1Client, dumpOjectToFile, mainnetClient } from "./utils.ts";

(async function main() {
  // dumpOjectToFile(await aave.getProtocolData(arb1Client), "aave/_arb1");
  // dumpOjectToFile(
  //   await symbiotic.getProtocolData(mainnetClient),
  //   "symbiotic/_ethPools",
  // );
  dumpOjectToFile(
    (await morpho.getProtocolData(mainnetClient)) as Object, // TODO: query typing
    "morpho/_ethPools",
  );
})()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
