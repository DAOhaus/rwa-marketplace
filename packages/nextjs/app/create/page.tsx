"use client";

// TODO: research better pattern for global state
// TODO: update useScaffoldContractRead to new version
// TODO: fix prettier putting in spaces that eslint is throwing errors on
import { createRef, useCallback, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Asset, vehicle } from "../../types/Asset";
import { DescribeForm } from "./_components/DescribeForm";
import { MintForm } from "./_components/MintForm";
import { TokenizeForm } from "./_components/TokenizeForm";
import { Box, Grid, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import { useDropzone } from "react-dropzone";
import { PhotoIcon } from "@heroicons/react/24/outline";
import { Input } from "~~/components";
import { singleUpload } from "~~/services/ipfs";

enum Stage {
  describe,
  tokenize,
  mint,
  attest,
}
export interface Erc20Data {
  name: string;
  symbol: string;
  supply: number;
  address: any;
  receipt: any;
}
export interface State {
  stage: number;
  setStage: (arg0: number) => void;
  asset: Asset;
  setAsset: (arg0: Asset) => void;
  erc20Data: Erc20Data;
  setErc20Data: (arg0: Erc20Data) => void;
}

export default function Page() {
  const searchParams = useSearchParams();
  //@ts-expect-error
  const defaultStage = Stage[searchParams.get("step") || "describe"];
  const [asset, setAsset] = useState<any>(vehicle);
  const [stage, setStage] = useState<number>(defaultStage);
  // change the initial erc20Data
  const [erc20Data, setErc20Data] = useState<Erc20Data>({
    name: "",
    symbol: "",
    supply: 0,
    address: "",
    receipt: {},
  });

  const state: State = {
    stage: stage,
    setStage: setStage,
    asset: asset,
    setAsset: setAsset,
    erc20Data: erc20Data,
    setErc20Data: setErc20Data,
  };

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      const returnedImageUrl = await singleUpload(file, file.name);
      console.log("url after upload", returnedImageUrl);
      setAsset({ ...asset, nft: { ...asset.nft, image: returnedImageUrl } });
    },
    [asset],
  );

  const { getRootProps } = useDropzone({ onDrop, accept: { "image/*": [] } });
  const dropZoneRef: React.LegacyRef<HTMLDivElement> | undefined = createRef();
  const handleStageClick = (e: any) => {
    if (process.env.NODE_ENV === "development") {
      setStage(Number(e.target.dataset.index));
    }
  };

  const handleInputChange = (e: { target: { value: any } }) => {
    console.log("e", e, e.target.value);
    setAsset({ ...asset, nft: { ...asset.nft, image: e.target.value } });
  };

  console.log("asset image", asset.nft.image);

  // RENDER
  return (
    <Grid w={"100vw"} h={"full"} templateColumns="repeat(2, 1fr)" gap={0}>
      <Box w={"full"} h={"full"} pos="relative" overflow={"hidden scroll"}>
        <Tabs w={"full"} h={"full"} index={stage} isLazy>
          <TabList
            pt={1}
            position={"sticky"}
            top={0}
            backgroundColor={"var(--chakra-colors-chakra-body-bg)"}
            className="z-10"
          >
            <Tab id="0" onClick={handleStageClick}>
              Describe
            </Tab>
            <Tab id="1" onClick={handleStageClick}>
              Tokenize
            </Tab>
            <Tab id="2" onClick={handleStageClick}>
              Mint
            </Tab>
          </TabList>

          <TabPanels>
            <TabPanel p={0}>
              <DescribeForm state={state} />
            </TabPanel>
            <TabPanel>
              <TokenizeForm state={state} />
            </TabPanel>
            <TabPanel>
              <MintForm state={state} />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
      <Box display={"flex"} flexDir={"column"} justifyContent={"start"} alignItems={"center"} padding={50}>
        <div
          {...getRootProps()}
          ref={dropZoneRef}
          className="w-full min-h-96 bg-neutral flex justify-center items-center rounded-lg"
        >
          <Box
            backgroundImage={asset.nft.image || ""}
            backgroundRepeat={"no-repeat"}
            backgroundSize={"contain"}
            backgroundPosition={"center"}
            transition={"background-image 1s ease-in-out"}
            display={"flex"}
            justifyContent={"center"}
            className={"w-full h-full " + (asset.image ? "auto" : "cursor-pointer")}
          >
            {!asset.nft.image && (
              <div className="flex flex-col justify-center ">
                <PhotoIcon className="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
                Upload Image
              </div>
            )}
          </Box>
        </div>
        <div className="flex flex-col justify-center w-full ">
          <div className="divider mt-8">OR</div>
          <Input
            name="NFT Image Url"
            placeholder="https://ipfs.io/pathToImage.jpg"
            value={asset.nft.image}
            onChange={handleInputChange}
          />
        </div>
      </Box>
    </Grid>
  );
}
