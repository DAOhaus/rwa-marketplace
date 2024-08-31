import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "ethers";

/**
 * Deploys a contract named "YourContract" using the deployer account and
 * constructor arguments set to the deployer address
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployTokenContract: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  /*
    On localhost, the deployer account is the one that comes with Hardhat, which is already funded.

    When deploying to live networks (e.g `yarn deploy --network goerli`), the deployer account
    should have sufficient balance to pay for the gas fees for contract creation.

    You can generate a random account with `yarn generate` which will fill DEPLOYER_PRIVATE_KEY
    with a random private key in the .env file (then used on hardhat.config.ts)
    You can run the `yarn account` command to check your balance in every network.
  */
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  await deploy("ERC1400", {
    from: deployer,
    log: true,
    autoMine: true,
    args: [
      "Sample Security Token",
      "SST",
      1,
      ["0x1DEA6076bC003a957B1E4774A93a8D9aB0CBC1C1", "0x1DEA6076bC003a957B1E4774A93a8D9aB0CBC1C1"],
      [
        "0x7374616e64617264000000000000000000000000000000000000000000000000",
        "0x616476616e636564000000000000000000000000000000000000000000000000",
      ],
    ],
  });
  const contract = await hre.ethers.getContract<Contract>("ERC1400", deployer);
  const factoryAddress = await contract.getAddress();
  console.log("👋 Minted ERC1400", factoryAddress);
};

export default deployTokenContract;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags security
deployTokenContract.tags = ["security"];
