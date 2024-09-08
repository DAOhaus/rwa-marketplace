"use client";

import Image from "next/image";
import packageJson from "../../../package.json";
import type { NextPage } from "next";
import { PageWrapper } from "~~/components";

const Home: NextPage = () => {
  return (
    <PageWrapper className="justify-center">
      <div className="text-center">
        <div>
          {/* <div className="text-6xl mb-4">
            <span style={{ color: "red", opacity: ".75" }}>A</span> U T O D A{" "}
            <span style={{ color: "red", opacity: ".75" }}>O</span>
            <br></br>
            </div> */}

          <Image
            alt="auto dao logo"
            className="cursor-pointer rounded-md"
            src="/logo_people.png"
            width={300}
            height={300}
          />
          {/* <SelectForm /> */}
          <div className="text-gray-500 mb-4 mt-4">
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
