"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import AssetManagementCard from "./_components/AssetManagementCard";
import Erc20Card from "./_components/Erc20Card";
// import { content, theme as tailwindTheme } from "~~/tailwind.config";
// import { useAllContracts } from "~~/utils/scaffold-eth/contractsData";
import MetadataCard from "./_components/MetadataCard";
import SalesInfoCard from "./_components/SalesInfoCard";
import { Box, Flex, Text } from "@chakra-ui/react";
import axios from "axios";
import { isObject } from "lodash";
import { PageWrapper } from "~~/components";
// import { useAccount } from "wagmi";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

/* eslint-disable @next/next/no-img-element */
function NFT() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  // const { address } = useAccount();
  const [data, setData] = useState<any>();
  // const [error, setError] = useState<string>();
  // const [isLoading, setLoading] = useState<boolean>(true);

  const { data: tokenURI } = useScaffoldReadContract({
    contractName: "NFTFactory",
    functionName: "tokenURI",
    args: [BigInt(id!)],
  });

  const getData = async (url: string) => {
    const response = await axios.get(url).catch(error => {
      console.log(error);
      throw "HTTP Request Error";
    });
    const data = response?.data;
    if (isObject(data)) {
      setData(data);
      // return data;
    } else {
      console.log("error:", response);
      throw "Data Improperly Formatted Error:" + url;
    }
  };

  useEffect(() => {
    if (tokenURI) {
      try {
        setData(JSON.parse(tokenURI));
      } catch {
        getData(tokenURI);
      }
    }
  }, [tokenURI]);
  console.log(data);

  return (
    <PageWrapper>
      <Text fontSize={34} fontWeight="bold" w="100%" align="left" m={0} mb={14}>
        {data?.name}
      </Text>
      <Flex wrap="wrap" gap={5} width="full" rowGap={20}>
        <Box flexGrow="1" textAlign="center">
          <div className="indicator relative mx-auto">
            <img
              alt="NFT Image"
              className="max-w-[32rem] min-w-[22rem] h-[26rem] rounded-lg object-cover z-0"
              src={data?.image}
              style={{
                objectFit: "cover",
              }}
              width="300"
            />
            <span className="indicator-item badge badge-secondary">#{id}</span>
          </div>
        </Box>
        <Box flexGrow="1.5">
          <MetadataCard json={data} className="mx-auto max-w-[32rem] min-w-[22rem] h-[26rem] overflow-y-scroll" />
        </Box>
      </Flex>
      <div className="divider w-[80%] my-[3rem] mx-auto"></div>
      <Flex wrap="wrap" gap={5} width="full" rowGap={20}>
        <Box className="mx-auto">
          <Erc20Card className="mx-auto max-w-[32rem] min-w-[22rem] h-[26rem] overflow-y-scroll" />
        </Box>
        <Box className="mx-auto">
          <SalesInfoCard className="mx-auto max-w-[32rem] min-w-[22rem] h-[26rem] overflow-y-scroll" />
        </Box>
        <Box className="mx-auto">
          <AssetManagementCard className="mx-auto max-w-[32rem] min-w-[22rem] h-[26rem] overflow-y-scroll" />
        </Box>
      </Flex>
    </PageWrapper>
  );
}
export default NFT;
