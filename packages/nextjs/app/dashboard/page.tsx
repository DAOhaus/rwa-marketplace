"use client";

import React from "react";
import { Flex } from "@chakra-ui/react";
// import { useAccount } from "wagmi";
import { Card, PageWrapper } from "~~/components";

// import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

const DashboardPage: React.FC = () => {
  // const { address } = useAccount();
  // const { data: nftBalance } = useScaffoldReadContract({
  //   contractName: "NFTFactory",
  //   functionName: "balanceOf",
  //   args: [address],
  // });
  return (
    <PageWrapper>
      <Flex align="start" width={"full"}>
        <h1 className="text-3xl font-bold mb-6">Hi, user</h1>
      </Flex>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 space-4">
        <Card>List asset for sale</Card>
        <Card>Distribute funds</Card>
        <Card>Request payment</Card>
        {/* Add dashboard content here */}
      </div>
    </PageWrapper>
  );
};

export default DashboardPage;
