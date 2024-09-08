"use client";

import React from "react";
// import { Flex } from "@chakra-ui/react";
import { useAccount } from "wagmi";
import { NFTCard, PageWrapper } from "~~/components";
// import { Address } from "~~/components/scaffold-eth";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

const DashboardPage: React.FC = () => {
  const { address } = useAccount();
  const { data: ownedTokenIds } = useScaffoldReadContract({
    contractName: "NFTFactory",
    functionName: "getTokensByAddress",
    args: [address],
  });
  console.log("ownedTokenIds:", ownedTokenIds);
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
      <h1 className="text-3xl font-bold mb-6 flex items-start text-left w-full">Your NFTs</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 space-4">
        {ownedTokenIds?.map(id => (
          <NFTCard key={id} id={id} />
        ))}
      </div>
    </PageWrapper>
  );
};

export default DashboardPage;
