"use client";

import { FC } from "react";
import NftPageCard from "./NftPageCard";
import { Box, SimpleGrid, Text } from "@chakra-ui/react";

interface Props {
  className?: string;
}

const nftDetailsNameStyle = { fontSize: 12, p: 0, m: 0, mt: 4 };

const SalesInfoCard: FC<Props> = ({ className }) => {
  return (
    <NftPageCard title={"Sales Information"} iconSvg="cart" className={className}>
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
    </NftPageCard>
  );
};

export default SalesInfoCard;
