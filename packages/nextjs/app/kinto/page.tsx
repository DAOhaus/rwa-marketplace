"use client";

import { useEffect, useState } from "react";
// import { ReactComponent as CreditImage } from "./credit.svg";
// import { BaseHeader, BaseScreen, GlobalLoader, KintoAddress, LearnLink, PrimaryButton } from "components/shared";
// import AppFooter from "components/shared/AppFooter";
// import AppHeader from "components/shared/AppHeader";
// import { BREAKPOINTS } from "config";
import { KintoAccountInfo, createKintoSDK } from "kinto-web-sdk";
// import numeral from "numeral";
import styled from "styled-components";
import { Address, createPublicClient, defineChain, encodeFunctionData, getContract, http } from "viem";
import contractsJSON from "~~/abis/7887.json";
import { PageWrapper } from "~~/components";

const BREAKPOINTS = {
  large: "1440px",
  standard: "1280px",
  tablet: "1024px",
  bmobile: "860px",
  mobile: "598px",
  smobile: "400px",
};
// import { useDeployedContractInfo } from "~~/hooks/scaffold-eth";

interface KYCViewerInfo {
  isIndividual: boolean;
  isCorporate: boolean;
  isKYC: boolean;
  isSanctionsSafe: boolean;
  getCountry: string;
  getWalletOwners: Address[];
}

const counterAbi = [
  { type: "constructor", inputs: [], stateMutability: "nonpayable" },
  {
    type: "function",
    name: "count",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  { type: "function", name: "increment", inputs: [], outputs: [], stateMutability: "nonpayable" },
];

const kinto = defineChain({
  id: 7887,
  name: "Kinto",
  network: "kinto",
  nativeCurrency: {
    decimals: 18,
    name: "ETH",
    symbol: "ETH",
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.kinto-rpc.com/"],
      webSocket: ["wss://rpc.kinto.xyz/ws"],
    },
  },
  blockExplorers: {
    default: { name: "Explorer", url: "https://kintoscan.io" },
  },
});

const KintoConnect = () => {
  const [accountInfo, setAccountInfo] = useState<KintoAccountInfo | undefined>(undefined);
  const [kycViewerInfo, setKYCViewerInfo] = useState<any | undefined>(undefined);
  const [counter, setCounter] = useState<number>(0);
  const [, setLoading] = useState<boolean>(false);
  const kintoSDK = createKintoSDK("0x14A1EC9b43c270a61cDD89B6CbdD985935D897fE");
  const counterAddress = "0x14A1EC9b43c270a61cDD89B6CbdD985935D897fE" as Address;

  // const NFTFactoryKycData = useDeployedContractInfo(contractName);

  async function kintoLogin() {
    try {
      await kintoSDK.createNewWallet();
    } catch (error) {
      console.error("Failed to login/signup:", error);
    }
  }

  async function fetchCounter() {
    const client = createPublicClient({
      chain: kinto,
      transport: http(),
    });

    const counter = getContract({
      address: counterAddress as Address,
      abi: counterAbi,
      client: { public: client },
    });
    const count = (await counter.read.count([])) as bigint;
    setCounter(parseInt(count.toString()));
  }

  async function increaseCounter() {
    const userData = await kintoLogin();
    console.log("userData:", userData);
    const data = encodeFunctionData({
      abi: counterAbi,
      functionName: "increment",
      args: [],
    });
    setLoading(true);
    try {
      const response = await kintoSDK.sendTransaction([
        { to: counterAddress as `0x${string}`, data, value: BigInt(0) },
      ]);
      console.log("response:", response);
      await fetchCounter();
    } catch (error) {
      console.error("Failed to login/signup:", error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchAccountInfo() {
    try {
      setAccountInfo(await kintoSDK.connect());
    } catch (error) {
      console.error("Failed to fetch account info:", error);
    }
  }

  useEffect(() => {
    fetchAccountInfo();
    fetchCounter();
  });

  useEffect(() => {
    async function fetchKYCViewerInfo() {
      if (!accountInfo?.walletAddress) return;

      const client = createPublicClient({
        chain: kinto,
        transport: http(),
      });
      const kycViewer = getContract({
        address: contractsJSON.contracts.KYCViewer.address as Address,
        abi: contractsJSON.contracts.KYCViewer.abi,
        client: { public: client },
      });

      try {
        const [isIndividual, isCorporate, isKYC, isSanctionsSafe, getCountry, getWalletOwners] = await Promise.all([
          kycViewer.read.isIndividual([accountInfo.walletAddress]),
          kycViewer.read.isCompany([accountInfo.walletAddress]),
          kycViewer.read.isKYC([accountInfo.walletAddress]),
          kycViewer.read.isSanctionsSafe([accountInfo.walletAddress]),
          kycViewer.read.getCountry([accountInfo.walletAddress]),
          kycViewer.read.getWalletOwners([accountInfo.walletAddress]),
        ]);

        setKYCViewerInfo({
          isIndividual,
          isCorporate,
          isKYC,
          isSanctionsSafe,
          getCountry,
          getWalletOwners,
        } as KYCViewerInfo);
      } catch (error) {
        console.error("Failed to fetch KYC viewer info:", error);
      }

      console.log("KYCViewerInfo:", kycViewerInfo);
    }
    if (accountInfo?.walletAddress) {
      fetchKYCViewerInfo();
    }
  }, [accountInfo, kycViewerInfo]);

  // todo: add info about the dev portal and link
  return (
    <PageWrapper>
      <WholeWrapper>
        <AppWrapper>
          <ContentWrapper>
            {accountInfo && (
              <BgWrapper>
                <CounterWrapper>
                  {!accountInfo.walletAddress && <div onClick={kintoLogin}>Login/Signup</div>}
                  <WalletRows>
                    <WalletRow key="chain">
                      <WalletRowName>Chain</WalletRowName>
                      <WalletRowValue>
                        <KintoLabel>Kinto (ID: 7887)</KintoLabel>
                      </WalletRowValue>
                    </WalletRow>
                    <WalletRow key="app">
                      <WalletRowName>App</WalletRowName>
                      <WalletRowValue>
                        <div>{counterAddress}</div>
                      </WalletRowValue>
                    </WalletRow>
                    <WalletRow key="address">
                      <WalletRowName>Wallet</WalletRowName>
                      <WalletRowValue>
                        <div>{accountInfo.walletAddress}</div>
                      </WalletRowValue>
                    </WalletRow>
                    <WalletRow key="Application Key">
                      <WalletRowName>App Key</WalletRowName>
                      <WalletRowValue>
                        <div>{accountInfo.appKey as Address}</div>
                      </WalletRowValue>
                    </WalletRow>
                    {kycViewerInfo && (
                      <>
                        <WalletRow key="isIndividual">
                          <WalletRowName>Is Individual</WalletRowName>
                          <WalletRowValue>
                            <ETHValue>{kycViewerInfo.isIndividual ? "Yes" : "No"}</ETHValue>
                          </WalletRowValue>
                        </WalletRow>
                        <WalletRow key="isCorporate">
                          <WalletRowName>Is Corporate</WalletRowName>
                          <WalletRowValue>
                            <ETHValue>{kycViewerInfo.isCorporate ? "Yes" : "No"}</ETHValue>
                          </WalletRowValue>
                        </WalletRow>
                        <WalletRow key="isKYC">
                          <WalletRowName>Is KYC</WalletRowName>
                          <WalletRowValue>
                            <ETHValue>{kycViewerInfo.isKYC ? "Yes" : "No"}</ETHValue>
                          </WalletRowValue>
                        </WalletRow>
                        <WalletRow key="isSanctionsSafe">
                          <WalletRowName>Is Sanctions Safe</WalletRowName>
                          <WalletRowValue>
                            <ETHValue>{kycViewerInfo.isSanctionsSafe ? "Yes" : "No"}</ETHValue>
                          </WalletRowValue>
                        </WalletRow>
                        <WalletRow key="country">
                          <WalletRowName>Country</WalletRowName>
                          <WalletRowValue>
                            <ETHValue>{kycViewerInfo.getCountry}</ETHValue>
                          </WalletRowValue>
                        </WalletRow>
                      </>
                    )}
                    <WalletRow key="counter">
                      <WalletRowName>Counter</WalletRowName>
                      <WalletRowValue>
                        <ETHValue>{counter}</ETHValue>
                      </WalletRowValue>
                    </WalletRow>
                  </WalletRows>
                  <WalletNotice>
                    <span>Attention!</span> Only send funds to your wallet address in the Kinto Network
                  </WalletNotice>
                  {accountInfo && <div onClick={increaseCounter}>Increase Counter</div>}
                </CounterWrapper>
              </BgWrapper>
            )}
          </ContentWrapper>
        </AppWrapper>
      </WholeWrapper>
    </PageWrapper>
  );
};

const WholeWrapper = styled.div`
  flex-flow: column nowrap;
  height: auto;
  align-items: center;
  width: 100%;
  display: flex;
  min-height: 100vh;
  min-width: 100vw;
  position: relative;
  left: 100px;
`;

const AppWrapper = styled.div`
  flex-flow: column nowrap;
  height: auto;
  align-items: center;
  width: 100%;
  display: flex;
  min-height: 85vh;
  min-width: 100vw;

  @media only screen and (max-width: 400px) {
    min-height: 90vh;
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  align-items: center;
  height: auto;
  min-height: 100vh;
  width: 100%;
  background: url(engen/commitment.svg) no-repeat;
  background-position-x: right;
  background-size: auto;
  overflow: hidden;
`;

const BgWrapper = styled.div`
  display: flex;
  width: 100%;
  flex-flow: column nowrap;
  justify-content: center;
`;

const CounterWrapper = styled.div`
  display: flex;
  flex-flow: column nowrap;
  align-items: flex-start;
  gap: 32px;
  padding: 16px 0;
`;

const WalletRows = styled.div`
  display: flex;
  padding-top: 16px;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  align-self: stretch;
  max-width: 800px;
  border-top: 1px solid var(--light-grey3);
`;

const WalletRow = styled.div`
  display: flex;
  flex-flow: row nowrap;
  padding-bottom: 16px;
  align-items: center;
  gap: 32px;
  align-self: stretch;
  border-bottom: 1px solid var(--light-grey3);
  width: 100%;
  overflow: hidden;
`;

const WalletRowName = styled.div`
  width: 150px;
  color: var(--night);
  font-size: 16px;
  font-weight: 700;
  text-transform: uppercase;

  @media only screen and (max-width: ${BREAKPOINTS.mobile}) {
    width: 60px;
    font-size: 14px;
  }
`;

const WalletRowValue = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  gap: 8px;
  flex: 1 0 0;
  align-self: stretch;
  font-size: 24px;
  font-weight: 700;
  line-height: 120%;

  @media only screen and (max-width: ${BREAKPOINTS.mobile}) {
    font-size: 20px;
  }
`;

const KintoLabel = styled.div`
  color: var(--night);
  font-size: 24px;
  font-weight: 400;
  line-height: 120%; /* 28.8px */
  @media only screen and (max-width: ${BREAKPOINTS.mobile}) {
    font-size: 20px;
  }
`;

const WalletNotice = styled.div`
  color: var(--dark-grey);
  font-size: 18px;
  font-weight: 400;
  width: 95%;

  span {
    color: var(--orange);
    font-weight: 700;
  }
`;

const ETHValue = styled.div`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  gap: 8px;
  font-size: 24px;
  font-weight: 400;
  line-height: 120%;
  color: var(--night);

  @media only screen and (max-width: ${BREAKPOINTS.mobile}) {
    font-size: 24px;
  }
`;

function App() {
  return (
    <div className="App">
      <KintoConnect />
    </div>
  );
}

export default App;
