import { useState } from "react";
import AssetTypes from "../../../types/Asset";
import { State } from "../page";
// import UploadInput from "./UploadInput";
import { Box, Flex, HStack, Select, Stack } from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { Alert, Button, Input, Text } from "~~/components";
import { Label } from "~~/components/Input";
import chainData from "~~/utils/chainData";
import { cleanAttributes, getAttribute, updateAttributes } from "~~/utils/helpers";

// TODO: all data fields aren't clearing on nft mint, such as document, the attributes of the nft itself

export const DescribeForm = ({ state }: { state: State }) => {
  const { stage, setStage, asset, setAsset } = state;
  const error = ""; //const [error, setError] = useState("");
  const [customAttribute, setCustomAttribute] = useState<any>({});
  // const [pdfUploading, setPdfUploading] = useState<boolean>(false);
  // const pdfAttribute = getAttribute(chainData.linkedPdfKey, asset.attributes);

  const canProceed = () => {
    let can = asset.name && asset.description;
    asset.attributes.map((attr: any) => (can = can && (attr.required ? attr.value : true)));
    return can;
  };

  const handleAttributeChange = (e: { target: { value: any; name: any } }) => {
    const value = e.target.value;
    const key = e.target.name;
    const newAsset = {
      ...asset,
      attributes: updateAttributes(asset.attributes, key, value),
    };
    setAsset(newAsset);
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
  //   const cleanedAttributes = cleanAttributes(asset.attributes, chainData.linkedPdfKey);
  //   setAsset({   // TODO
  //     ...asset,
  //     nft: {...asset, attributes: [...cleanedAttributes, pdfAddition]}
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
          defaultValue={asset.name}
          onChange={e => setAsset({ ...asset, name: e.target.value })}
          placeholder="NFT Name"
        />
        <Input
          label="NFT Description"
          name="description"
          textarea
          defaultValue={asset.description}
          onChange={e => setAsset({ ...asset, description: e.target.value })}
          placeholder="This token represents my physical asset located at..."
        />
        <Box>
          <Input
            value={getAttribute(chainData.linkedPdfKey, asset.attributes)?.value || ""}
            name={chainData.linkedPdfKey}
            label="Linked Document"
            placeholder={"https://website.com/document.pdf"}
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
        <Input
          name="category"
          inputElement={
            <Select
              onChange={e => {
                const newCategory = e.target.value;
                if (newCategory !== null) {
                  setAsset(AssetTypes[newCategory]);
                }
              }}
              value={getAttribute("category", asset.attributes)?.value || ""}
              className="placeholder:"
            >
              <option value="blank">None</option>
              <option value="realEstate">Real Estate</option>
              <option value="vehicle">Vehicle</option>
              <option value="art">Art</option>
            </Select>
          }
        />

        {cleanAttributes(asset.attributes, chainData.linkedPdfKey).map((attr: any) =>
          attr.hideInList ? null : (
            <Input
              key={attr.trait_type}
              defaultValue={attr.value}
              name={attr.trait_type}
              type={attr.inputType}
              label={attr.trait_type}
              placeholder={attr.placeholder}
              onChange={handleAttributeChange}
            />
          ),
        )}
        <Box>
          <Box>
            <HStack>
              <Box width={"50%"} pr={1}>
                <Label>Custom Attribute</Label>
              </Box>
              <Box width={"50%"} pr={1}>
                <Label>Value </Label>
              </Box>
            </HStack>
            <HStack mb={2}>
              <Box width={"50%"} pr={1}>
                <Input
                  label={"none"}
                  type="text"
                  placeholder="attribute"
                  onChange={e => setCustomAttribute({ ...customAttribute, trait_type: e.target.value })}
                />
              </Box>
              <Box width={"50%"}>
                <Input
                  label={"none"}
                  type="text"
                  placeholder="value"
                  onChange={e => setCustomAttribute({ ...customAttribute, value: e.target.value })}
                />
              </Box>
            </HStack>
          </Box>
          <Button
            w={"full"}
            variant={"outline"}
            colorScheme="teal"
            onClick={() => {
              setAsset({ ...asset, attributes: [...asset.attributes, customAttribute] });
            }}
          >
            + Add Attribute
          </Button>
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
