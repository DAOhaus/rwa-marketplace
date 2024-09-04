"use client";

import React from "react";
import { PageWrapper } from "~~/components";

const DashboardPage: React.FC = () => {
  return (
    <PageWrapper>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{/* Add dashboard content here */}</div>
      </div>
    </PageWrapper>
  );
};

export default DashboardPage;
