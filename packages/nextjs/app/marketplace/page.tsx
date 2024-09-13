"use client";

import React from "react";
// import { Address } from "~~/components/scaffold-eth";
// import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";
// import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
// import { Box, Flex, Select, Stack, Grid } from "@chakra-ui/react";
// import { Alert, Button, Input, Text } from "~~/components";
import { SearchBar } from "./_components/SearchBar";
// import { Flex } from "@chakra-ui/react";
// import { useAccount } from "wagmi";
import { NFTCard, PageWrapper } from "~~/components";

// import { Filter } from "./_components/Filter";

const MarketplacePage: React.FC = () => {
  // const { address } = useAccount();

  // let not = BigInt(0); // numberOfTokens
  // try {
  //   while (true) {
  //     const { data: numberOfTokens } = useScaffoldReadContract({
  //       contractName: "NFTFactory",
  //       functionName: "ownerOf",
  //       args: [not],
  //     });
  //   }
  // } catch {

  // }

  // const ownedTokenIds: BigInt[] = [];
  // for (let i = 0; i < not; i++) {
  //   ownedTokenIds.push(BigInt(i));
  // }

  // console.log(ownedTokenIds);

  // const { data: numberOfTokens } = useScaffoldReadContract({
  //         contractName: "NFTFactory",
  //         functionName: "ownerOf",
  //         args: [BigInt(0)],
  //       });
  // console.log(numberOfTokens);

  const tokenIds = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  return (
    <PageWrapper>
      <h1 className="text-3xl font-bold mb-6 flex items-start text-left w-full">Marketplace</h1>
      {/* <div className="relative h-11 flex flex-1 flex-shrink-0">
        <input
          className="peer block w-1/2 h-11 rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
          placeholder="search"
          // defaultValue={searchParams.get('query')?.toString()}
          // onChange={(e) => {
          //   handleSearch(e.target.value);
          // }}
        />
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
      </div> */}

      {/* <Grid w={"100vw"} h={"full"} templateColumns="350px 1fr" gap={0}> */}
      <SearchBar />

      {/* <Filter /> */}
      {/* </Grid> */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 space-4">
        {tokenIds?.map(id => (
          <NFTCard key={id} id={String(id)} />
        ))}
      </div>
    </PageWrapper>
  );
};

export default MarketplacePage;
