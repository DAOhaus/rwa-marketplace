import React from "react";
import { Button, Link } from "@chakra-ui/react";
import { colors } from "~~/tailwind.config";

const PurchaseButton = ({ id }: { id: string | bigint }) => {
  return (
    <Link className="w-full" href={`/nft?id=${id}`}>
      <Button width={"full"} bgColor={colors.green}>
        Purchase
      </Button>
    </Link>
  );
};

export default PurchaseButton;
