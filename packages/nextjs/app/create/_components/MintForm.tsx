// /* eslint-disable prettier/prettier */
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Erc20Data, State } from "../page";
import { Box, Code, Flex, HStack, Stack } from "@chakra-ui/react";
import { createThirdwebClient } from "thirdweb";
import { upload } from "thirdweb/storage";
import { parseEther } from "viem";
import { useAccount } from "wagmi";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { Alert, Button, Text } from "~~/components";
import { Address } from "~~/components/scaffold-eth";
import { useScaffoldEventHistory, useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

// import confetti from "canvas-confetti";

export const MintForm = ({ state }: { state: State }) => {
  const {
    stage,
    setStage,
    asset,
    setAsset,
    erc20Data,
    setErc20Data,
  }: {
    stage: any;
    setStage: (arg0: any) => void;
    asset: any;
    setAsset: (arg0: any) => void;
    erc20Data: Erc20Data;
    setErc20Data: (arg0: Erc20Data) => void;
  } = state;

  const router = useRouter();
  const { address } = useAccount();
  const [error, setError] = useState("");
  const canProceed = asset.receipt.transactionHash && erc20Data.address; // could be fooled with 2 half mints (?)

  const canStart = () => {
    // TODO add the image url
    let can = erc20Data.name && erc20Data.symbol && erc20Data.supply && asset.nft.name && asset.nft.description;

    asset.nft.attributes.map(
      (attr: any, indx: any) => (can = can && (asset.attributeDetails[indx].required ? attr.value : true)),
    );
    return can;
  };

  const { writeContractAsync: erc20Factory } = useScaffoldWriteContract("ERC20Factory");
  const { writeContractAsync: nftFactory } = useScaffoldWriteContract("NFTFactory");

  const { data: deployedTokens } = useScaffoldReadContract({
    contractName: "ERC20Factory",
    functionName: "getTokensByOwner",
    args: [address],
  });

  const {
    data: events,
    // isLoading: isLoadingEvents,  TODO?
    // error: errorReadingEvents,   TODO?
  } = useScaffoldEventHistory({
    contractName: "NFTFactory",
    eventName: "TokenMinted",
    fromBlock: BigInt(0),
    watch: true,
    filters: { to: address },
    blockData: true,
    transactionData: true,
    receiptData: true,
  });

  useEffect(() => {
    if (events !== undefined) {
      setAsset({ ...asset, id: events[0].args.tokenId });
    }
  }, [events]); // eslint-disable-line react-hooks/exhaustive-deps

  // function randomInRange(min: number, max: number) {
  //   return Math.random() * (max - min) + min;
  // }
  // const win_effect = () => {
  //   confetti({
  //     angle: randomInRange(55, 125),
  //     spread: randomInRange(50, 70),
  //     particleCount: randomInRange(50, 100),
  //     origin: { y: 0.6 },
  //     ticks: 3000,
  //     gravity: 2,
  //   });
  // };

  const client = createThirdwebClient({
    clientId: process.env.NEXT_PUBLIC_THIRD_WEB_CLIENT as string,
  });

  const jsonToString = (e: any) => {
    return JSON.stringify(e, (_, value) => (typeof value === "bigint" ? value.toString() : value));
  };

  return (
    <Stack pl={2} pr={4} gap={4}>
      <Button
        onClick={() => {
          console.log(events);
        }}
      >
        events
      </Button>
      <Text size={"xl"}>ERC20 Token</Text>
      <Text>The liquid token linked to your NFT</Text>
      <Code p={3}>
        <span className="font-bold">name</span>: {erc20Data.name}
        <br></br>
        <span className="font-bold">symbol</span>: {erc20Data.symbol}
        <br></br>
        <span className="font-bold">supply</span>: {erc20Data.supply}
        <br></br>
      </Code>

      <Text size={"xl"}>NFT Mint</Text>
      <Text>Uploads Token & Metadata to IPFS for NFT</Text>
      <Code p={3} w={"100%"}>
        <span className="font-bold">name</span>: {asset.nft.name}
        <br></br>
        <span className="line-clamp-3">
          <span className="font-bold">description</span>: {asset.nft.description}
        </span>
        <br></br>
        <span className="font-bold">attributes</span>:
        <Box pl={4}>
          {asset.nft.attributes.map((attr: any, i: any) => (
            <Text display={"block"} key={i}>
              <span className="font-bold">{attr.trait_type}</span>: {attr.value}
            </Text>
          ))}
        </Box>
      </Code>

      {canStart() ? (
        <>
          <div className="flex items-center mt-2 space-x-2">
            <Button
              // pointerEvents={loadingStates.nft ? "none" : "auto"}
              // isLoading={loadingStates.nft}
              loadingText="Minting"
              colorScheme="teal"
              size="sm"
              onClick={async () => {
                if (address !== undefined)
                  try {
                    setError("");
                    const uri = await upload({
                      client: client,
                      files: [new File([jsonToString(asset.nft)], "metadata.json")],
                    });
                    const actualUri = `https://${process.env.NEXT_PUBLIC_THIRD_WEB_CLIENT}.ipfscdn.io/ipfs/${
                      uri.split("//")[1]
                    }`;
                    console.log(actualUri);
                    await erc20Factory(
                      {
                        functionName: "createToken",
                        args: [
                          erc20Data.name,
                          erc20Data.symbol,
                          address,
                          "0x0000000000000000000000000000000000000000", // address associatedNFT_
                          BigInt(0), // uint256 associatedNFTId_
                          [address],
                          [parseEther(String(erc20Data.supply))],
                        ],
                      },
                      {
                        onBlockConfirmation: txnReceipt => {
                          console.log("📦 Transaction blockHash", txnReceipt.blockHash);

                          if (Array.isArray(deployedTokens) && deployedTokens.length > 0) {
                            const lastDeployedToken = deployedTokens.pop();
                            if (typeof lastDeployedToken === "string") {
                              setErc20Data({ ...erc20Data, receipt: txnReceipt, address: String(lastDeployedToken) });
                            }
                          }
                        },
                      },
                    );
                  } catch (e) {
                    console.log("mint error", e);
                    setError(e as string);
                  }

                if (address !== undefined)
                  try {
                    setError("");
                    // TODO
                    // let updatedNftData = nftData;
                    // const returnedImageUrl = await singleUpload(nftData.file, nftData.file.name);
                    // updatedNftData = {
                    //   ...nftData,
                    //   imageUrl: returnedImageUrl
                    // }
                    // setNftData(updatedNftData);
                    // // }
                    // console.log('nftData', updatedNftData);
                    // debugger;
                    // const nftDataString = JSON.stringify(mapNftData(updatedNftData));
                    // console.log('nftData & String:', nftData, nftDataString, [address, nftDataString, nftData.erc20.deployedTokenAddress, '0x36372b07'])
                    // debugger;

                    let erc20Address;
                    if (Array.isArray(deployedTokens) && deployedTokens.length > 0) {
                      const lastDeployedToken = deployedTokens.pop();
                      if (typeof lastDeployedToken === "string") {
                        erc20Address = String(lastDeployedToken);
                      }
                    }
                    await nftFactory(
                      {
                        functionName: "mint",
                        args: [
                          address,
                          "tokenUri", // TODO
                          erc20Address,
                          [""], // TODO
                        ],
                      },
                      {
                        onBlockConfirmation: txnReceipt => {
                          console.log("📦 Transaction blockHash", txnReceipt.blockHash);
                          setAsset({ ...asset, receipt: txnReceipt });
                        },
                      },
                    );
                    // win_effect();  TODO
                  } catch (error) {
                    console.log("nft mint error", error);
                    setError(error as string);
                  }
              }}
            >
              Mint
            </Button>
          </div>
          {erc20Data.address ? (
            <div className="flex">
              🥳 ERC20 adress:&nbsp;&nbsp;
              <Address address={erc20Data.address} disableAddressLink={true} format="short" size="sm" />
            </div>
          ) : (
            <></>
          )}
          {asset.receipt.transactionHash ? <div className="flex">🥳 NFT id:&nbsp;&nbsp;{String(asset.id)}</div> : <></>}
        </>
      ) : (
        <Text size="base">Fill in the required fields !</Text>
      )}

      {error && <Alert type="error" message={error.toString ? error.toString() : error} />}
      {!address && <Alert type="error" message="Connect wallet in order to be enable mint" />}
      <HStack>
        <Box width={"50%"}>
          <Button width={"full"} onClick={() => setStage(stage - 1)}>
            <Flex width={"full"} justifyContent={"space-between"} alignItems={"center"}>
              <ChevronLeftIcon width="20" /> Back{" "}
              <ChevronRightIcon opacity={0} width={20} className="justify-self-end" />
            </Flex>
          </Button>
        </Box>
        <Box width={"50%"}>
          <Button
            width={"full"}
            colorScheme={"teal"}
            isDisabled={!canProceed}
            onClick={() => {
              router.push(`/nft?id=${asset.id}`);
            }}
          >
            <Flex width={"full"} justifyContent={"space-between"} alignItems={"center"}>
              <ChevronLeftIcon opacity={0} width="20" /> View{" "}
              <ChevronRightIcon width={20} className="justify-self-end" />
            </Flex>
          </Button>
        </Box>
      </HStack>
    </Stack>
  );
};
