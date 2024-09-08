import React from "react";
import Link from "next/link";
import styled from "styled-components";
import { Button, Card } from "~~/components";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";
import { stringToJsonSafe } from "~~/utils/helpers";

interface CardProps {
  className?: string;
  id: string | bigint;
}

const StyledCard = styled(Card)`
  .css-selector: "attribute";
`;

const NFTCard: React.FC<CardProps> = ({ className, id }) => {
  const bigIntId = BigInt(id);
  const tokenURI = useScaffoldReadContract({
    contractName: "NFTFactory",
    functionName: "tokenURI",
    args: [bigIntId],
  }).data;

  console.log("tokenURI", tokenURI);
  if (!tokenURI) return;
  const nftData = stringToJsonSafe(tokenURI);
  // const metadata = (
  //   <div className="grid grid-cols-2 gap-2">
  //     <div className="flex flex-col">
  //       Symbol
  //       {nftData.symbol}
  //     </div>
  //     <div>ID</div>
  //     <div>Address</div>
  //     <div>Chain</div>
  //   </div>
  // );
  // symbol id address chain
  return nftData ? (
    <StyledCard
      title={nftData?.name}
      className={`${className || ""}`}
      imageUrl={nftData.image}
      footer={
        <Link className="w-full" href={`/nft?id=${id}`}>
          <Button width={"full"} colorScheme="teal">
            View Details
          </Button>
        </Link>
      }
    >
      {nftData.description}
      {/* <div className="divider"></div>
      {metadata} */}
    </StyledCard>
  ) : (
    <></>
  );
};

export default NFTCard;
