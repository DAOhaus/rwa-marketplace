"use client";

import React, { useEffect, useState } from "react";
import Featured from "./_components/Featured";
import { SearchBar } from "./_components/SearchBar";
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
  const [searchTerm, setSearchTerm] = useState("");
  // const [cards, setCards] = useState<any>();
  // const [filters, setFilters] = useState([]);

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

  // useEffect(() => {
  //   const cards_ = tokenIds?.map(id => id>11&&(
  //     <GridItem key={id} colSpan={{ base: 6, md: 3, lg: 2 }}>
  //       <NFTMarketplaceCard id={id} nftData={getNftData({id:id, searchTerm:searchTerm}).nftData} />
  //     </GridItem>
  //   ))
  //   setCards(cards_);
  // }, [tokenIds, searchTerm]);

  const cards_ = tokenIds?.map(id => {
    return (
      id > 11 && (
        <GridItem key={id} colSpan={{ base: 6, md: 3, lg: 2 }}>
          <NFTMarketplaceCard id={id} searchTerm={searchTerm} />
        </GridItem>
      )
    );
  });

  // const nftCards = () => {
  // const nfts: any = [];
  // if (tokenIds.length < 1) return;

  // tokenIds?.map(id => {
  //   if (id <= 11) return null;
  //   if (id === undefined) return null;
  //   const [data, hide] = getNftData({id:id, searchTerm:searchTerm});
  //   if (hide) return null;
  //   nfts.push([data, id]);
  // })

  // const cards_ = nfts?.map((nft:any) => (<NFTMarketplaceCard id={nft[0]} nftData={nft[1]} />))
  //   .filter((e:any)=>e!==undefined)
  //   .filter((e:any)=>e!==null)
  //   .filter(React.isValidElement)
  //   .map((e:any, s:any)=>(
  //     <GridItem key={s} colSpan={{ base: 6, md: 3, lg: 2 }}>
  //       {e}
  //     </GridItem>
  //   ));

  // tokenIds?.map(id => id>11&&(
  //   /* {tokenIds?.map(id => ( */
  //   <GridItem key={id} colSpan={{ base: 6, md: 3, lg: 2 }}>
  //     <NFTMarketplaceCard id={id} searchTerm={searchTerm} />
  //   </GridItem>
  // ))
  // }

  // console.log("!ownedTokenIds:", address, tokenIds);
  return (
    <PageWrapper>
      <Text fontSize={34} fontWeight="bold" w="100%" align="left" m={0} mb={14}>
        Marketplace
      </Text>
      <SearchBar setSearchTerm={setSearchTerm} /> {/*To fix border colors*/}
      <Featured />
      {/* <button onClick={()=>console.log(searchTerm)}>sth</button> */}
      <Grid key={`${searchTerm}`} templateColumns="repeat(6, 1fr)" gap="24px">
        {cards_}
      </Grid>
    </PageWrapper>
  );
};

export default MarketplacePage;
