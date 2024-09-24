import React from "react";
import { Box, Button, HStack, Stack } from "@chakra-ui/react";
import PurchaseButton from "~~/components/PurchaseButton";
import { colors } from "~~/tailwind.config";

const Featured = () => {
  return (
    <Box
      w="full"
      h="300px"
      my={10}
      // borderWidth={2}
      // borderColor={colors.grey}
      backgroundImage="url('featuredMarketplaceImage.png')"
      backgroundSize={"cover"}
      backgroundPosition="center"
      backgroundRepeat="no-repeat"
    >
      <Stack m={10}>
        <Box mb={2} fontWeight={"bold"} fontSize={18}>
          2025 Land Rover Defender Octa
        </Box>
        <Box fontWeight={"bold"}>By Vehicles_Blocks</Box>
        <Box my={2} fontWeight={"bold"}>
          999 tokens &#xa0;•&#xa0; 0.0333 ETH
        </Box>

        <HStack>
          <Box>
            <PurchaseButton id={"10"} />
          </Box>
          <Box>
            <Button
              borderWidth={2}
              borderColor={colors.lightestGrey}
              bgColor="rgba(255,0,0,0)"
              textColor={colors.white}
            >
              View Details
            </Button>
          </Box>
        </HStack>
      </Stack>
    </Box>
  );
};

export default Featured;
