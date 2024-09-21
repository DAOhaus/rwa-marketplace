import React from "react";
import Link from "next/link";
import { Box, SimpleGrid, Text } from "@chakra-ui/react";
// import styled from "styled-components";
import { Button, Card } from "~~/components";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";
import { ipfsToJsonSafe, stringToJsonSafe } from "~~/utils/helpers";

interface CardProps {
  className?: string;
  id: string | bigint;
}

// const StyledCard = styled(Card)`
//   .css-selector: "attribute";
// `;

const NFTCard: React.FC<CardProps> = ({ className, id }) => {
  const bigIntId = BigInt(id);
  const tokenURI = useScaffoldReadContract({
    contractName: "NFTFactory",
    functionName: "tokenURI",
    args: [bigIntId],
  }).data;

  // console.log("!id and data", bigIntId, tokenURI);

  console.log("tokenURI", tokenURI);

  if (!tokenURI) return;

  let nftData;
  if (tokenURI.slice(0, 4) === "http") nftData = ipfsToJsonSafe(tokenURI);
  else nftData = stringToJsonSafe(tokenURI);

  const nftDetailsStyle = {
    fontSize: 12,
    backgroundColor: "yellow.100",
    p: 0,
    pl: 1,
    m: 0,
    mt: 4,
  };

  // symbol id address chain
  return (
    nftData && (
      <Card
        // title={nftData?.name}
        title="The Legendary Car"
        className={`${className || ""}`}
        imageUrl={nftData.image}
        footer={
          <Link className="w-full" href={`/nft?id=${id}`}>
            <Button width={"full"} bgColor="#84CC16">
              Purchase
            </Button>
          </Link>
        }
        compact={true}
      >
        {/* {nftData.description} */}
        <SimpleGrid columns={2} spacingX={4}>
          <Box>
            <Text sx={nftDetailsStyle}>Price</Text>
          </Box>
          <Box>
            <Text sx={nftDetailsStyle}>Chain</Text>
          </Box>

          <Box>{(Math.random() * 10).toPrecision(3)} ETH</Box>
          <Box w="120px">Polygon</Box>

          <Box>
            <Text sx={nftDetailsStyle}>KYC</Text>
          </Box>
          <Box>
            <Text sx={nftDetailsStyle}>Token Symbol</Text>
          </Box>

          <Box>YES</Box>
          <Box>LGT</Box>
        </SimpleGrid>
      </Card>
    )
  );
};

export default NFTCard;
