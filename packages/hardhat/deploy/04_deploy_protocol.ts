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

  await deploy("ERC20Factory", {
    from: deployer,
    log: true,
    args: ["ERC20Factory"],
    autoMine: true,
  });
  const contract = await hre.ethers.getContract<Contract>("ERC20Factory", deployer);
  const factoryAddress = await contract.getAddress();
  console.log("👋 Minted ERC20 Factory", factoryAddress);

  //
  // STBL
  //
  await deploy("ERC20Ownable", {
    from: deployer,
    log: true,
    args: [
      "LEGT Stable Token",
      "STBL",
      deployer,
      factoryAddress,
      "0x0000000000000000000000000000000000000000",
      0,
      [deployer],
      ["100000000000000000000000000"],
    ],
    autoMine: true,
  });
  const stable = await hre.ethers.getContract<Contract>("ERC20Ownable", deployer);
  await stable.transferOwnership(deployer);
  const s_address = await stable.getAddress();
  const s_name = await stable.name();
  console.log(`✅ ${s_name}`, s_address);

  //
  // LEGT
  //
  await deploy("ERC20Ownable", {
    from: deployer,
    log: true,
    args: [
      "LEGT Governance Token",
      "LEGT",
      deployer,
      factoryAddress,
      "0x0000000000000000000000000000000000000000",
      0,
      [deployer],
      ["100000000000000000000000000"],
    ],
    autoMine: true,
  });
  const governance = await hre.ethers.getContract<Contract>("ERC20Ownable", deployer);
  await governance.transferOwnership(deployer);
  const g_address = await governance.getAddress();
  const g_name = await governance.name();
  console.log(`✅ ${g_name}`, g_address);

  //
  // NFT FACTORY
  //
  await deploy("NFTFactory", {
    from: deployer,
    log: true,
    args: ["NFTFactory", "NFTF"],
    autoMine: true,
  });
  const nft = await hre.ethers.getContract<Contract>("NFTFactory", deployer);
  const nft_address = await nft.getAddress();
  const nft_name = await nft.name();
  console.log(`✅ ${nft_name}`, nft_address);

  //
  // TOKEN SALE
  //
  await deploy("TokenSale", {
    from: deployer,
    log: true,
    args: [deployer, deployer],
    autoMine: true,
  });
  const sale = await hre.ethers.getContract<Contract>("TokenSale", deployer);
  const sale_address = await sale.getAddress();
  console.log(`✅ Token Sale`, sale_address);
};

export default deployTokenContract;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags protocol
deployTokenContract.tags = ["protocol"];
