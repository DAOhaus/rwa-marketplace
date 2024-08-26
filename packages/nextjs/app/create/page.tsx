"use client";

// TODO: research better pattern for global state
// TODO: update useScaffoldContractRead to new version
// TODO: fix prettier putting in spaces that eslint is throwing errors on
import { createRef, useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { DescribeForm } from "./_components/DescribeForm";
// import { MintForm } from "./_components/MintForm";
// import { TokenizeForm } from "./_components/TokenizeForm";
import { Box, Grid, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import axios from "axios";
import { isObject } from "lodash";
import type { NextPage } from "next";
import { useDropzone } from "react-dropzone";
import { PhotoIcon } from "@heroicons/react/24/outline";

// import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";
// import useGlobalState, { nft } from "~~/services/store/store";

enum Stage {
  describe,
  tokenize,
  mint,
  attest,
}

// interface NFTType {
//   imageUrl?: string;
//   name?: string;
//   address?: string;
//   file?: Blob;
// }

const ListingForm: NextPage = () => {
  const searchParams = useSearchParams();
  //@ts-expect-error
  const defaultStage = Stage[searchParams.get("step") || "describe"];
  const id = searchParams.get("id");
  // const [nftData, setNftData] = useGlobalState(nft);
  const [nftData, setNftData] = useState<any>({});
  const [stage, setStage] = useState<number>(defaultStage);
  const [existingData, setData] = useState<any>();
  const router = useRouter();

  // const tokenURI = useScaffoldContractRead({
  //   contractName: "NFTFactory",
  //   functionName: "tokenURI",
  //   args: [id],
  // }).data;

  const tokenURI = "https://url.to.data";

  const onDrop = useCallback(
    async (event: any) => {
      if (nftData.address) {
        console.log("existing", event);
      } else {
        console.log("create", event);
        let imageUrl;
        try {
          const isPdf = event[0].type.includes("pdf");
          const defaultPDFImage =
            "https://ipfs-gateway.legt.co/ipfs/bafybeicqz376dgkrmrykjcrdafclqke4bzzqao3yymbbly4fjr4kdwttii";
          imageUrl = isPdf ? defaultPDFImage : URL.createObjectURL(event[0]);
        } catch (error) {}
        setNftData({ ...nftData, file: event[0], imageUrl });
      }
      router.push("/create");
    },
    [nftData, setNftData, router],
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

  const existingImageUrl = nftData.imageUrl || existingData?.image;
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
        className={nftData.imageUrl ? "auto" : "cursor-pointer"}
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
              <DescribeForm setStage={setStage} stage={stage} />
            </TabPanel>
            <TabPanel>{/* <TokenizeForm setStage={setStage} stage={stage} /> */}</TabPanel>
            <TabPanel>{/* <MintForm setStage={setStage} stage={stage} /> */}</TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Grid>
  );
};

export default ListingForm;
