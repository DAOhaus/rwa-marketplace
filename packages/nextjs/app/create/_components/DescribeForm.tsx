import { useState } from "react";
import AssetTypes from "../../../types/Asset";
import { State } from "../page";
// import UploadInput from "./UploadInput";
import { Box, Flex, Select, Stack } from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { Alert, Button, Input, Text } from "~~/components";
import chainData from "~~/utils/chainData";
import { cleanAttributes, getAttribute, updateAttributes } from "~~/utils/helpers";

// TODO: all data fields aren't clearing on nft mint, such as document, the attributes of the nft itself

export const DescribeForm = ({ state }: { state: State }) => {
  const { stage, setStage, asset, setAsset } = state;
  const error = ""; //const [error, setError] = useState("");
  const [dimoAddress, setDimoAddress] = useState("");
  // const [pdfUploading, setPdfUploading] = useState<boolean>(false);
  // const pdfAttribute = getAttribute(chainData.linkedPdfKey, asset.nft.attributes);

  const canProceed = () => {
    let can = asset.nft.name && asset.nft.description;
    asset.nft.attributes.map((attr: any) => (can = can && (attr.required ? attr.value : true)));
    return can;
  };

  const canProceedDimo = () => {
    return dimoAddress.length === 42;
  };

  const handleAttributeChange = (e: { target: { value: any; name: any } }) => {
    const value = e.target.value;
    const key = e.target.name;
    const newAsset = {
      ...asset,
      nft: {
        ...asset.nft,
        attributes: updateAttributes(asset.nft.attributes, key, value),
      },
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
  //   const cleanedAttributes = cleanAttributes(asset.nft.attributes, chainData.linkedPdfKey);
  //   setAsset({   // TODO
  //     ...asset,
  //     nft: {...asset.nft, attributes: [...cleanedAttributes, pdfAddition]}
  //   });
  //   setError("");
  //   setPdfUploading(false);
  // };

  // Define the GraphQL query
  const query1 = `{
  vehicles(filterBy: {owner: "${dimoAddress}"}, first: 1) {
    nodes {
      tokenId
      privileges(first: 10) {
        nodes {
          setAt
          expiresAt
          id
        }
      }
    }
  }
}`;

  const query2 = (tokenId: any) => `{
  vehicle (tokenId: ${tokenId}) {
    definition {
      make
      model
      year
    }
  }
}`;

  const endpoint = "https://identity-api.dimo.zone/query";

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
                    nft: { ...asset.nft, attributes: AssetTypes[newCategory].nft.attributes },
                    category: newCategory,
                  });
                }
              }}
              value={asset.category}
              // placeholder="Select option"
              className="placeholder:"
            >
              <option value="vehicle">Vehicle</option>
              <option value="realEstate">Real Estate</option>
              <option value="art">Art</option>
            </Select>
          }
        />
        <Box>
          <Input
            value={getAttribute(chainData.linkedPdfKey, asset.nft.attributes)?.value || ""}
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
        {asset.category === "vehicle" ? (
          <Box>
            <Input
              name={"dimo"}
              label="DIMO User"
              placeholder={"0xf5c0337B31464D4f2232FEb2E71b4c7A175e7c52"}
              note={
                <span>
                  Optional - this will populate the fields below with your car data registered in DIMO.{" "}
                  <a href="https://dimo.xyz" target="_blank" className="underline">
                    Learn More.
                  </a>{" "}
                </span>
              }
              onChange={(e: { target: { value: any; name: any } }) => {
                setDimoAddress(e.target.value);
              }}
              groupedElemet={
                <Button
                  colorScheme={"teal"}
                  isDisabled={!canProceedDimo()}
                  onClick={async () => {
                    try {
                      const response = await fetch(endpoint, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ query: query1 }),
                      });
                      if (response.ok) {
                        const result = await response.json();
                        const tokenId = result.data["vehicles"]["nodes"][0]["tokenId"];
                        // console.log('tokenId: ', tokenId);

                        try {
                          const response2 = await fetch(endpoint, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ query: query2(tokenId) }),
                          });
                          if (response2.ok) {
                            const result2 = await response2.json();
                            const dimoAttributes = result2.data["vehicle"]["definition"];
                            //console.log('dimo attributes: ', dimoAttributes);
                            setAsset({
                              ...asset,
                              nft: {
                                ...asset.nft,
                                attributes: updateAttributes(
                                  updateAttributes(
                                    updateAttributes(asset.nft.attributes, "model", dimoAttributes["model"]),
                                    "make",
                                    dimoAttributes["make"],
                                  ),
                                  "year",
                                  dimoAttributes["year"],
                                ),
                              },
                            });
                          } else {
                            console.error("Error:", response2.statusText);
                          }
                        } catch (error) {
                          console.error("Fetch error:", error);
                        }
                      } else {
                        console.error("Error:", response.statusText);
                      }
                    } catch (error) {
                      console.error("Fetch error:", error);
                    }
                  }}
                >
                  <Flex width={"full"} justifyContent={"space-between"} alignItems={"center"}>
                    import
                  </Flex>
                </Button>
              }
            />
          </Box>
        ) : (
          <></>
        )}
        {cleanAttributes(asset.nft.attributes, chainData.linkedPdfKey)
          .filter(a => a.required)
          .map((attr: any) => (
            <Input
              key={attr.trait_type}
              defaultValue={attr.value}
              name={attr.trait_type}
              type={attr.inputType}
              label={attr.trait_type}
              placeholder={attr.placeholder}
              onChange={handleAttributeChange}
            />
          ))}
        {/* <Box>
          <HStack>
            <Box width={"50%"} pr={1}>
              <InputLabel>Attribute</InputLabel>
            </Box>
            <Box width={"50%"} pr={1}>
              <InputLabel>Value </InputLabel>
            </Box>
          </HStack>
        </Box> */}

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
