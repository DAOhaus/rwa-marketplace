"use client";

import React, { useEffect, useState } from "react";
import Featured from "./_components/Featured";
import { SearchBar } from "./_components/SearchBar";
import { Text } from "@chakra-ui/react";
import { useAccount } from "wagmi";
import { NFTMarketplaceCard, PageWrapper } from "~~/components";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

const MarketplacePage: React.FC = () => {
  const { address } = useAccount();
  const [tokenIds, setTokenIds] = useState<bigint[]>([]);
  const [lastFetchedAddress, setLastFetchedAddress] = useState<string | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState("");
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

  return (
    <PageWrapper>
      <Text fontSize={34} fontWeight="bold" w="100%" align="left" m={0} mb={14}>
        Marketplace
      </Text>
      <SearchBar setSearchTerm={setSearchTerm} /> {/*To fix border colors*/}
      <Featured />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 space-4">
        {tokenIds?.map((id, i) => (
          <NFTMarketplaceCard key={i} id={id} searchTerm={searchTerm} />
        ))}
      </div>
    </PageWrapper>
  );
};

export default MarketplacePage;
