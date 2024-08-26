// TODO: bring over the IPFS upload service but don't call it "fleek"
// TODO: bring over the IPFS upload service but don't call it "fleek"
import { useState } from "react";
import UploadInput from "./UploadInput";
import { Box, Flex, HStack, Select, Stack } from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { Alert, Button, Input, InputLabel, Text } from "~~/components";
import chainData from "~~/utils/chainData";
import { createAttribute, getAttribute } from "~~/utils/helpers";

// import Input, { Label } from "~~/components/Input";
// import { singleUpload } from "~~/services/fleek";
// import useGlobalState, { nft } from "~~/services/store/store";
// import { groupByKeyValue } from "~~/utils/helpers";

const cleanAttributes = (attributes: Array<{ trait_type: string }>, duplicateString: string) =>
  (attributes || []).filter((att: { trait_type: string }) => att.trait_type != duplicateString);

export const DescribeForm = ({
  setStage,
  stage,
  jsonData,
}: {
  setStage: (arg0: number) => void;
  stage: number;
  jsonData: any;
}) => {
  // const [nftData, setNftData] = useGlobalState(nft);
  const [nftData, setNftData] = useState<any>({});
  const [error, setError] = useState("");
  const [pdfUploading, setPdfUploading] = useState<boolean>(false);
  const pdfAttribute = getAttribute(chainData.linkedPdfKey, nftData.attributes);

  const [menuIndex, setMenuIndex] = useState(0);
  const [assetAttr, setAssetAttr] = useState(jsonData[menuIndex].attributes);

  const canProceed = () => {
    // let can = nftData.name && nftData.description && nftData.file;
    let can = nftData.name && nftData.description;
    assetAttr.map((attr: any) => {
      can = can && (assetAttr[assetAttr.indexOf(attr)].required ? eval(`nftData.${attr.name}`) : true);
    });
    return can;
  };

  const handleAttributeChange = (e: { target: { value: any; name: any } }) => {
    const value = e.target.value;
    const key = e.target.name;
    setNftData({ ...nftData, [key]: value });
  };
  const handlePdfDrop = async (event: any) => {
    console.log("event", event);
    if (pdfUploading) return;
    // const handleError = (err: string) => {
    //   setError(err);
    //   setPdfUploading(false);
    // };
    setPdfUploading(true);
    // const pdfHash = await singleUpload(event[0], event[0].path, handleError);
    const pdfHash = "0xNeedsToReplaceThis";
    console.log("pdfHash:", pdfHash);
    const pdfAddition = createAttribute(chainData.linkedPdfKey, chainData.baseIPFSUrl + pdfHash);
    const cleanedAttributes = cleanAttributes(nftData.attributes, chainData.linkedPdfKey);
    setNftData({
      ...nftData,
      attributes: [...cleanedAttributes, pdfAddition],
    });
    setError("");
    setPdfUploading(false);
  };
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
          defaultValue={nftData.name}
          onChange={e => setNftData({ ...nftData, name: e.target.value })}
          placeholder="NFT Name"
        />
        <Input
          label="NFT Description"
          name="description"
          textarea
          defaultValue={nftData.description}
          onChange={e => setNftData({ ...nftData, description: e.target.value })}
          placeholder="This token represents my physical asset located at..."
        />
        <Input
          name="category"
          inputElement={
            <Select
              onChange={e => {
                const newCategory = e.target.value;
                if (newCategory !== null) {
                  // clear attributes
                  const assetAttributes: any = [];
                  jsonData.map((e: any) => {
                    e.attributes.map((a: any) => {
                      assetAttributes.push(a.name);
                    });
                  });
                  assetAttributes.map((e: any) => {
                    eval(`delete nftData.${e};`);
                  });

                  setNftData({ ...nftData, category: newCategory });
                  const isTheOne = (element: any) => element.assetClass === newCategory;
                  const indx: number = jsonData.findIndex(isTheOne);
                  setMenuIndex(indx);
                  setAssetAttr(eval(`jsonData[${indx}].attributes`));
                }
              }}
              value={nftData.category}
              placeholder="Select option"
              className="placeholder:"
            >
              <option value="art">Art</option>
              <option value="real_estate">Real Estate</option>
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
          {assetAttr.map((attr: any) => (
            // make the key unique
            <HStack key={attr.name} mb={2}>
              <Box width={"50%"} pr={1}>
                <InputLabel>{attr.name}</InputLabel>
              </Box>
              <Box width={"50%"}>
                <Input
                  defaultValue={attr.defaultValue}
                  name={attr.name}
                  type={attr.inputType}
                  label={"none"}
                  placeholder={attr.defaultValue}
                  onChange={handleAttributeChange}
                />
              </Box>
            </HStack>
          ))}
        </Box>
        <Box>
          <InputLabel>Linked Document</InputLabel>
          <Input
            value={getAttribute(chainData.linkedPdfKey, nftData.attributes)?.value}
            onChange={e => {
              const pdfAddressString = e.target.value;
              const documentAttribute = createAttribute(chainData.linkedPdfKey, pdfAddressString);
              const cleanedAttributes = cleanAttributes(nftData?.attributes, chainData.linkedPdfKey);
              const updatedAttributes = [...cleanedAttributes, documentAttribute];
              setNftData({
                ...nftData,
                attributes: updatedAttributes,
              });
            }}
            placeholder="https://website.com/document.pdf"
          />
          <div className="divider">OR</div>
          <UploadInput
            type="pdf"
            loading={pdfUploading}
            onDrop={handlePdfDrop}
            height={"20vh"}
            success={!!pdfAttribute}
            acceptedFileType="pdf"
          />
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
