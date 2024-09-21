"use client";

import React, { useEffect, useState } from "react";
// import { SearchBar } from "./_components/SearchBar";
import { Grid, GridItem, Text } from "@chakra-ui/react";
// import { Flex } from "@chakra-ui/react";
import { useAccount } from "wagmi";
import { NFTMarketplaceCard, PageWrapper } from "~~/components";
// import { Address } from "~~/components/scaffold-eth";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

const MarketplacePage: React.FC = () => {
  const { address } = useAccount();
  const [tokenIds, setTokenIds] = useState<bigint[]>([]);
  const [lastFetchedAddress, setLastFetchedAddress] = useState<string | undefined>(undefined);

  const { data: fetchedTokenIds, refetch } = useScaffoldReadContract({
    contractName: "NFTFactory",
    functionName: "getTokensByAddress",
    args: [address],
  });

  useEffect(() => {
    const fetchTokenIds = async () => {
      if ((address && tokenIds.length === 0) || address !== lastFetchedAddress) {
        await refetch();
        if (fetchedTokenIds) {
          setTokenIds([...fetchedTokenIds]); //"1","2","3","4" BigInt(1),BigInt(2),BigInt(3),BigInt(4)
          setLastFetchedAddress(address);
        }
      }
    };

    fetchTokenIds();
  }, [address, lastFetchedAddress, tokenIds.length, refetch, fetchedTokenIds]);

  console.log("!ownedTokenIds:", address, tokenIds);
  return (
    <PageWrapper>
      {/* <Flex align="start" width={"full"}>
        <h1 className="text-3xl font-bold mb-6 flex">
          Hi, <Address address={address} disableAvatar disableAddressLink />
        </h1>
      </Flex> */}
      {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6 space-4">
        <Card>List asset for sale</Card>
        <Card>Distribute funds</Card>
        <Card>Request payment</Card>
      </div> */}
      {/* <h1 className="text-3xl font-bold mb-6 flex items-start text-left w-full">Marketplace</h1> */}
      <Text fontSize={34} fontWeight="bold" w="100%" align="left" m={0} mb={14}>
        Marketplace
      </Text>

      <Grid templateColumns="repeat(6, 1fr)" gap="24px">
        {tokenIds?.map(id => (
          <GridItem key={id} colSpan={{ base: 6, md: 3, lg: 2 }}>
            <NFTMarketplaceCard id={id} />
          </GridItem>
        ))}
      </Grid>
      {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6 space-4">
        {tokenIds?.map(id => (
          <NFTMarketplaceCard key={id} id={id} />
        ))}
      </div> */}
    </PageWrapper>
  );
};

export default MarketplacePage;
