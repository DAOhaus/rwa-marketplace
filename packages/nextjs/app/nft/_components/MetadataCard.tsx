"use client";

import { FC } from "react";
import NftPageCard from "./NftPageCard";
import { Table, TableContainer, Tbody, Td, Tr } from "@chakra-ui/react";

interface Props {
  json: any;
  className?: string;
}

const MetadataCard: FC<Props> = ({ json, className }) => {
  return (
    <NftPageCard title={"Metadata"} iconSvg="database" className={className}>
      <TableContainer>
        <Table variant="unstyled">
          <Tbody>
            {json?.attributes.map((a: any, i: any) => (
              <Tr key={i}>
                <Td p={1.5}>{a.trait_type}</Td>
                <Td p={1.5} textAlign={"right"} fontWeight={"bold"}>
                  {a.value}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </NftPageCard>
  );
};

export default MetadataCard;
