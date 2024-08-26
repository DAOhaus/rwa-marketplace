"use client";

import packageJson from "../../../package.json";
import { Box } from "@chakra-ui/react";
import type { NextPage } from "next";
// import SelectForm from "~~/app/create/_components/SelectForm";
import { PageWrapper } from "~~/components";

const Home: NextPage = () => {
  return (
    <PageWrapper className="justify-center">
      <div className="text-center">
        <div>
          <div className="text-6xl mb-4">
            <span style={{ color: "red", opacity: ".75" }}>A</span> U T O D A{" "}
            <span style={{ color: "red", opacity: ".75" }}>O</span>
            <br></br>
          </div>

          <Box maxW="md" mb={8} marginX={"auto"} maxWidth={"500px"}></Box>
          {/* <SelectForm /> */}
          <div className="text-gray-500 mb-4">
            <div>securely attach your title to NFT</div>
            <div>get paid for supplying your auto data</div>
            <div>buy cars with verifiable details</div>
            <div>crypto loans for your car</div>
          </div>
          <div className="text-gray-300 mb-8">v{packageJson.version}</div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Home;
