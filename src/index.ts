import aave from "./aave";
import symbiotic from "./symbiotic";
import morpho from "./morpho";
import { arb1Client, dumpOjectToFile, mainnetClient } from "./utils";

(async function main() {
  dumpOjectToFile(await aave.getProtocolData(arb1Client), "arb1");
  dumpOjectToFile(await symbiotic.getProtocolData(mainnetClient), "ethPools");
  dumpOjectToFile(await morpho.getProtocolData(mainnetClient), "morphoEthPools");
})()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
