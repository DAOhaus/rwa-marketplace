"use client";

// TODO: research better pattern for global state
// TODO: update useScaffoldContractRead to new version
// TODO: fix prettier putting in spaces that eslint is throwing errors on
import { createRef, useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Asset, art } from "./_components/Asset";
import { DescribeForm } from "./_components/DescribeForm";
import { MintForm } from "./_components/MintForm";
import { TokenizeForm } from "./_components/TokenizeForm";
import { Box, Grid, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import axios from "axios";
import { isObject } from "lodash";
import { useDropzone } from "react-dropzone";
import { PhotoIcon } from "@heroicons/react/24/outline";

// import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";

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

// interface NFTType {
//   imageUrl?: string;
//   name?: string;
//   address?: string;
//   file?: Blob;
// }

export default function Page() {
  const searchParams = useSearchParams();
  //@ts-expect-error
  const defaultStage = Stage[searchParams.get("step") || "describe"];
  const id = searchParams.get("id");
  const [asset, setAsset] = useState<any>(art);
  const [stage, setStage] = useState<number>(defaultStage);
  // change the initial erc20Data
  const [erc20Data, setErc20Data] = useState<Erc20Data>({
    name: "myT",
    symbol: "myS",
    supply: 100,
    address: "",
    receipt: {},
  });
  const [existingData, setData] = useState<any>();
  const router = useRouter();

  const state: State = {
    stage: stage,
    setStage: setStage,
    asset: asset,
    setAsset: setAsset,
    erc20Data: erc20Data,
    setErc20Data: setErc20Data,
  };

  // const tokenURI = useScaffoldContractRead({
  //   contractName: "NFTFactory",
  //   functionName: "tokenURI",
  //   args: [id],
  // }).data;

  const tokenURI = "https://url.to.data";

  const onDrop = useCallback(
    async (event: any) => {
      if (asset.address) {
        // <--- this probably does not work
        console.log("existing", event);
      } else {
        console.log("create", event);
        let image;
        try {
          const isPdf = event[0].type.includes("pdf");
          const defaultPDFImage =
            "https://ipfs-gateway.legt.co/ipfs/bafybeicqz376dgkrmrykjcrdafclqke4bzzqao3yymbbly4fjr4kdwttii";
          image = isPdf ? defaultPDFImage : URL.createObjectURL(event[0]);
        } catch (error) {}
        setAsset({ ...asset, file: event[0], image: image });
      }
      router.push("/create");
    },
    [asset, setAsset, router],
  );
  const { getRootProps } = useDropzone({ onDrop });
  const dropZoneRef: React.LegacyRef<HTMLDivElement> | undefined = createRef();
  const handleStageClick = (e: any) => {
    if (process.env.NODE_ENV === "development") {
      setStage(Number(e.target.dataset.index));
    }
  };

  const getData = async (url: string) => {
    const response = await axios.get(url).catch(error => {
      console.log(error);
      throw "HTTP Request Error";
    });
    const data = response?.data;
    if (isObject(data)) {
      return data;
    } else {
      console.log("error:", response);
      throw "Data Improperly Formated Error:" + url;
    }
  };

  useEffect(() => {
    if (!existingData && tokenURI) {
      getData(tokenURI)
        .catch((error): any => {
          console.log(error);
        })
        .then(response => {
          setData(response);
        });
    }
  }, [existingData, tokenURI, id]);

  const existingImageUrl = asset.image || existingData?.image;
  // RENDER
  return (
    <Grid w={"100vw"} h={"full"} templateColumns="repeat(2, 1fr)" gap={0}>
      <Box
        {...getRootProps()}
        ref={dropZoneRef}
        backgroundImage={existingImageUrl || ""}
        backgroundSize={"contain"}
        backgroundPosition={"center"}
        transition={"background-image 1s ease-in-out"}
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
        borderRight={"1px solid #CBCCE0"}
        className={asset.image ? "auto" : "cursor-pointer"}
      >
        {!existingImageUrl && (
          <div className="flex flex-col justify-center ">
            <PhotoIcon className="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
            Upload Image
          </div>
        )}
      </Box>
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
    </Grid>
  );
}
