import React from "react";
import PurchaseButton from "./PurchaseButton";
import { Box, SimpleGrid, Text } from "@chakra-ui/react";
// import styled from "styled-components";
import { Card } from "~~/components";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";
import { ipfsToJsonSafe, stringToJsonSafe } from "~~/utils/helpers";

interface CardProps {
  className?: string;
  id: string | bigint;
  searchTerm: string;
}

// const StyledCard = styled(Card)`
//   .css-selector: "attribute";
// `;

const NFTCard: React.FC<CardProps> = ({ className, id, searchTerm = "" }) => {
  const tokenURI = useScaffoldReadContract({
    contractName: "NFTFactory",
    functionName: "tokenURI",
    args: [BigInt(id)],
  }).data;
  if (!tokenURI) return;
  const nftData = tokenURI.slice(0, 4) === "http" ? ipfsToJsonSafe(tokenURI) : stringToJsonSafe(tokenURI);
  const nftDataString = JSON.stringify(nftData);

  const nftDetailsNameStyle = { fontSize: 12, p: 0, m: 0, mt: 4 };
  return (
    nftData &&
    nftDataString.includes(searchTerm) && (
      <Card
        // title={nftData?.name}
        title="The Legendary Car"
        className={`${className || ""}`}
        imageUrl={nftData?.image}
        footer={<PurchaseButton id={id} />}
        compact={true}
      >
        {/* {nftData.description} */}
        <SimpleGrid columns={2} spacingX={4}>
          <Box>
            <Text sx={nftDetailsNameStyle}>Price</Text>
          </Box>
          <Box>
            <Text sx={nftDetailsNameStyle}>Chain</Text>
          </Box>

          <Box fontWeight="bold">{(Math.random() * 10).toPrecision(3)} ETH</Box>
          <Box fontWeight="bold" w="120px">
            Polygon
          </Box>

          <Box>
            <Text sx={nftDetailsNameStyle}>KYC</Text>
          </Box>
          <Box>
            <Text sx={nftDetailsNameStyle}>Token Symbol</Text>
          </Box>

          <Box fontWeight="bold">YES</Box>
          <Box fontWeight="bold">LGT</Box>
        </SimpleGrid>
      </Card>
    )
  );
};

export default NFTCard;
