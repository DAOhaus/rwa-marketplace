// /* eslint-disable prettier/prettier */
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Erc20Data, State } from "../page";
import {
  Box,
  Checkbox,
  Code,
  Flex,
  HStack,
  Stack,
  Step,
  StepDescription,
  StepIcon,
  StepIndicator,
  StepNumber,
  StepSeparator,
  StepStatus,
  StepTitle,
  Stepper,
  useSteps,
} from "@chakra-ui/react";
import { parseEther } from "viem";
import { useAccount } from "wagmi";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { Alert, Button, Text } from "~~/components";
import { Address } from "~~/components/scaffold-eth";
import { useScaffoldEventHistory, useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

// import confetti from "canvas-confetti";
// import { singleUpload } from '~~/services/fleek';

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
  //console.log(state);

  const router = useRouter();
  const [loadingStates, setLoadingStates] = useState<{ token?: boolean; nft?: boolean }>({});
  const { address } = useAccount();
  const [error, setError] = useState("");
  const canProceed = asset.receipt.transactionHash;

  const canStart = () => {
    // TODO add the image url
    let can =
      erc20Data.name &&
      erc20Data.symbol &&
      erc20Data.supply &&
      asset.nft.name &&
      asset.nft.description &&
      asset.nft.external_url;

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
      console.log(events);
    }
    console.log(state);
  }, [events]);

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

  const steps = canStart()
    ? [
        ...[
          {
            title: "ERC20 Token",
            description: "The liquid token linked to your NFT",
            body: (
              <>
                <Code p={3}>
                  <span className="font-bold">name</span>: {erc20Data.name}
                  <br></br>
                  <span className="font-bold">symbol</span>: {erc20Data.symbol}
                  <br></br>
                  <span className="font-bold">supply</span>: {erc20Data.supply}
                  <br></br>
                </Code>
              </>
            ),
            cta: (
              <Button
                mt={4}
                pointerEvents={loadingStates.token ? "none" : "auto"}
                isLoading={loadingStates.token}
                loadingText="Minting"
                colorScheme="teal"
                size="sm"
                onClick={async () => {
                  if (address !== undefined)
                    // to refactor or sth
                    try {
                      setError("");
                      setLoadingStates({ token: true });
                      await erc20Factory(
                        {
                          functionName: "createToken",
                          args: [
                            erc20Data.name,
                            erc20Data.symbol,
                            address,
                            "0x0000000000000000000000000000000000000000",
                            BigInt(0),
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
                      setLoadingStates({ token: false });
                      setActiveStep(activeStep + 1);
                    } catch (e) {
                      console.log("mint error", e);
                      setError(e as string);
                      setLoadingStates({ token: false });
                    }
                }}
              >
                Mint
              </Button>
            ),
            result: (
              <div className="flex">
                🥳 <Address address={erc20Data.address} disableAddressLink={true} format="short" size="sm" />
              </div>
            ),
          },
        ],
        {
          title: "NFT Mint",
          description: "Uploads Token & Metadata to IPFS for NFT",
          body: (
            <>
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
            </>
          ),
          cta: (
            <div className="flex items-center mt-2 space-x-2">
              <Button
                pointerEvents={loadingStates.nft ? "none" : "auto"}
                isLoading={loadingStates.nft}
                loadingText="Minting"
                colorScheme="teal"
                size="sm"
                onClick={async () => {
                  if (address !== undefined)
                    // to refactor or sth
                    try {
                      setError("");
                      setLoadingStates({ nft: true });

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

                      await nftFactory(
                        {
                          functionName: "mint",
                          args: [
                            address,
                            "tokenUri", // TODO
                            erc20Data.address,
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
                      setLoadingStates({});
                      setActiveStep(steps.length);
                      // win_effect();  TODO
                    } catch (error) {
                      console.log("nft mint error", error);
                      setError(error as string);
                      setLoadingStates({});
                    }
                }}
              >
                Mint
              </Button>
              <Checkbox disabled> IPFS (coming soon)</Checkbox>
            </div>
          ),
          result: (
            <div className="flex">
              🥳 <Address address={asset.nft.address} disableAddressLink={true} format="short" size="sm" />
            </div>
          ),
        },
      ]
    : [];

  const { activeStep, setActiveStep } = useSteps({
    index: asset.receipt.transactionHash ? 2 : erc20Data.address ? 1 : 0,
    // index: 0,
    count: steps.length,
  });

  //      <Button onClick={()=>{console.log(state);}}>hehe</Button>
  /* <Button onClick={()=>{console.log(state);}}>state</Button>
      <Button onClick={()=>{console.log(events);
                            if (events!==undefined)
                              console.log(events[0].args.to);
                            if (events!==undefined)
                              console.log(events[0].args.tokenId);}}>events</Button> */
  return (
    <Stack pl={2} pr={4} gap={4}>
      <Text tiny>
        We&apos;ll walk you through the mint proccess which takes all the provided information into consideration
      </Text>
      <Stepper index={activeStep} orientation="vertical" gap="0">
        {steps.map((step, index) => (
          <Step
            key={index}
            style={{
              width: "100%",
              opacity: `${activeStep === index || activeStep === steps.length ? 1 : 0.35}`,
            }}
          >
            <StepIndicator>
              <StepStatus complete={<StepIcon />} incomplete={<StepNumber />} active={<StepNumber />} />
            </StepIndicator>
            <Box flexShrink="0" width={"100%"} mb={6}>
              <StepTitle>{step.title}</StepTitle>
              <StepDescription>{step.description}</StepDescription>
              <Box mt={2}> {step.body} </Box>
              {activeStep === index ? step.cta : null}
              {activeStep > index ? step.result : null}
            </Box>
            <StepSeparator />
          </Step>
        ))}
      </Stepper>
      {error && <Alert type="error" message={error.toString ? error.toString() : error} />}
      {!address && <Alert type="error" message="Connect wallet in order to enable mint" />}
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
