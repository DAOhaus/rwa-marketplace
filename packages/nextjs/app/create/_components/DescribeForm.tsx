// TODO: bring over the IPFS upload service but don't call it "fleek"
// TODO: bring over the IPFS upload service but don't call it "fleek"
// import { useState } from "react";
import { State } from "../page";
// import { createAttribute, getAttribute } from "~~/utils/helpers";
import { art, car, realEstate } from "./Asset";
// import UploadInput from "./UploadInput";
import { Box, Flex, HStack, Select, Stack } from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { Alert, Button, Input, InputLabel, Text } from "~~/components";
import chainData from "~~/utils/chainData";
import { getAttribute } from "~~/utils/helpers";

// import Input, { Label } from "~~/components/Input";
// import { singleUpload } from "~~/services/fleek";
// import useGlobalState, { nft } from "~~/services/store/store";
// import { groupByKeyValue } from "~~/utils/helpers";

// const cleanAttributes = (attributes: Array<{ trait_type: string }>, duplicateString: string) =>
//   (attributes || []).filter((att: { trait_type: string }) => att.trait_type != duplicateString);

export const DescribeForm = ({ state }: { state: State }) => {
  const { stage, setStage, asset, setAsset } = state;
  const error = ""; //const [error, setError] = useState("");
  // const [pdfUploading, setPdfUploading] = useState<boolean>(false);
  // const pdfAttribute = getAttribute(chainData.linkedPdfKey, asset.nft.attributes);

  const canProceed = () => {
    let can = asset.nft.name && asset.nft.description;
    asset.nft.attributes.map(
      (attr: any, indx: any) => (can = can && (asset.attributeDetails[indx].required ? attr.value : true)),
    );
    return can;
  };

  const getAssetFromCategory = (category: string) =>
    category === "art" ? art : category === "realEstate" ? realEstate : car;
  const handleAttributeChange = (e: { target: { value: any; name: any } }) => {
    const value = e.target.value;
    const key = e.target.name;
    setAsset({
      ...asset,
      nft: {
        ...asset.nft,
        attributes: asset.nft.attributes.map((attr: any) =>
          attr.trait_type === key ? { trait_type: attr.trait_type, value: String(value) } : attr,
        ),
      },
    });
  };
  // const handlePdfDrop = async (event: any) => {
  //   console.log("event", event);
  //   if (pdfUploading) return;
  //   const handleError = (err: string) => {
  //     setError(err);
  //     setPdfUploading(false);
  //   };
  //   setPdfUploading(true);
  //   const pdfHash = await singleUpload(event[0], event[0].path, handleError);
  //   const pdfHash = "0xNeedsToReplaceThis";
  //   console.log("pdfHash:", pdfHash);
  //   const pdfAddition = createAttribute(chainData.linkedPdfKey, chainData.baseIPFSUrl + pdfHash);
  //   const cleanedAttributes = cleanAttributes(asset.nft.attributes, chainData.linkedPdfKey);
  //   setAsset({   // TODO
  //     ...asset,
  //     nft: {...asset.nft, attributes: [...cleanedAttributes, pdfAddition]}
  //   });
  //   setError("");
  //   setPdfUploading(false);
  // };
  return (
    <>
      <Stack p={4} gap={4}>
        <Text tiny>
          Describe your token and list useful information about it. Adding additional attributes below will be stored
          the metadata following the
          <a
            style={{ textDecoration: "underline" }}
            target="_blank"
            href="https://docs.opensea.io/docs/metadata-standards#attributes"
            rel="noreferrer"
          >
            {" "}
            OpenSea Standard
          </a>
        </Text>

        <Input
          label="NFT Name"
          name="name"
          defaultValue={asset.nft.name}
          onChange={e => setAsset({ ...asset, nft: { ...asset.nft, name: e.target.value } })}
          placeholder="NFT Name"
        />
        <Input
          label="NFT Description"
          name="description"
          textarea
          defaultValue={asset.nft.description}
          onChange={e => setAsset({ ...asset, nft: { ...asset.nft, description: e.target.value } })}
          placeholder="This token represents my physical asset located at..."
        />
        <Input
          name="category"
          inputElement={
            <Select
              onChange={e => {
                const newCategory = e.target.value;
                if (newCategory !== null) {
                  setAsset({
                    ...asset,
                    nft: { ...asset.nft, attributes: getAssetFromCategory(newCategory).nft.attributes },
                    attributeDetails: getAssetFromCategory(newCategory).attributeDetails,
                    category: newCategory,
                  });
                }
              }}
              value={asset.category}
              // placeholder="Select option"
              className="placeholder:"
            >
              <option value="art">Art</option>
              <option value="realEstate">Real Estate</option>
              <option value="car">Car</option>
            </Select>
          }
        />
        <Box>
          <HStack>
            <Box width={"50%"} pr={1}>
              <InputLabel>Attribute</InputLabel>
            </Box>
            <Box width={"50%"} pr={1}>
              <InputLabel>Value </InputLabel>
            </Box>
          </HStack>
          {asset.nft.attributes.map((attr: any, indx: any) => {
            if (attr.trait_type !== "file")
              return (
                // make the key unique
                <HStack key={attr.trait_type} mb={2}>
                  <Box width={"50%"} pr={1}>
                    <InputLabel>{attr.trait_type}</InputLabel>
                  </Box>
                  <Box width={"50%"}>
                    <Input
                      defaultValue={asset.attributeDetails[indx].defaultValue}
                      name={attr.trait_type}
                      type={asset.attributeDetails[indx].inputType}
                      label={"none"}
                      placeholder={asset.attributeDetails[indx].defaultValue}
                      onChange={handleAttributeChange}
                    />
                  </Box>
                </HStack>
              );
          })}
        </Box>
        <Box>
          <InputLabel>Linked Document</InputLabel>

          <Input
            value={getAttribute(chainData.linkedPdfKey, asset.nft.attributes)?.value}
            name={"file"}
            type={asset.attributeDetails[asset.attributeDetails.length - 1].inputType}
            label={"none"}
            placeholder={asset.attributeDetails[asset.attributeDetails.length - 1].defaultValue}
            onChange={handleAttributeChange}
          />
          {/* <div className="divider">OR</div>
          <UploadInput
            type="pdf"
            loading={pdfUploading}
            onDrop={handlePdfDrop}
            height={"20vh"}
            success={!!pdfAttribute}
            acceptedFileType="pdf"
          /> */}
        </Box>
        {error && <Alert type="error" message={error} />}
        <Button colorScheme={"teal"} isDisabled={!canProceed()} onClick={() => setStage(stage + 1)}>
          <Flex width={"full"} justifyContent={"space-between"} alignItems={"center"}>
            <ChevronLeftIcon opacity={0} width="20" /> Next <ChevronRightIcon width={20} className="justify-self-end" />
          </Flex>
        </Button>
      </Stack>
    </>
  );
};
