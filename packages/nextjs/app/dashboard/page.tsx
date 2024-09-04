"use client";

import React from "react";
import { Flex } from "@chakra-ui/react";
import { Card, PageWrapper } from "~~/components";

const DashboardPage: React.FC = () => {
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
