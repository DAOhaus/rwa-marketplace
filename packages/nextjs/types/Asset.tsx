// TODO: combine attributeData into the attributes themselves and provider a function to remove unused fields from attribute to be used before saving
export interface Attribute {
  trait_type: string;
  value: string;
  placeholder?: string;
  inputType?: string;
  required?: boolean;
  hideInList?: boolean;
}
export interface Nft {
  name: string;
  description: string;
  image: string;
  attributes: Attribute[];
}
export interface Asset {
  nft: Nft;
  category: string;
  id: bigint;
  receipt: any;
}

interface AssetTypes {
  vehicle: Asset;
  art: Asset;
  realEstate: Asset;
  [key: string]: Asset;
}

export const art: Asset = {
  nft: {
    description: "",
    image: "",
    name: "",
    attributes: [
      { trait_type: "cateogry", value: "art", hideInList: true },
      { trait_type: "title", value: "", placeholder: "Man in Hat", required: true },
      { trait_type: "artist", value: "", placeholder: "Davinci", required: true },
      { trait_type: "year", inputType: "number", value: "", placeholder: "1999", required: true },
      { trait_type: "medium", value: "" },
      { trait_type: "dimensions", value: "" },
    ],
  },
  category: "art",
  id: BigInt(0),
  receipt: {},
};
export const realEstate: Asset = {
  nft: {
    description: "",
    image: "",
    name: "",
    attributes: [
      { trait_type: "cateogry", value: "real estate", hideInList: true },
      { trait_type: "address", value: "", required: true },
      { trait_type: "property type", value: "", required: true },
      { trait_type: "square footage", value: "", required: true },
      { trait_type: "year built", value: "" },
      { trait_type: "bedrooms", value: "" },
      { trait_type: "bathrooms", value: "" },
    ],
  },
  category: "realEstate", //TOANSWER: are these keys for after an NFT is minted or what is the purpose?
  id: BigInt(0),
  receipt: {},
};
export const vehicle: Asset = {
  nft: {
    description: "",
    image: "",
    name: "",
    attributes: [
      { trait_type: "cateogry", value: "vehicle", hideInList: true },
      { trait_type: "model", value: "", placeholder: "G Wagon", required: true },
      { trait_type: "make", value: "", placeholder: "Mercedes", required: true },
      { trait_type: "year", value: "", inputType: "number", placeholder: "2020", required: true },
      { trait_type: "color", value: "", placeholder: "White" },
      { trait_type: "mileage", value: "", inputType: "number", placeholder: "100000" },
    ],
  },
  category: "vehicle",
  id: BigInt(0),
  receipt: {},
};

export const sanitizeNftAttributes = (nft: Nft) => {
  return {
    ...nft,
    attributes: nft.attributes.map(attr => attr.value && { trait_type: attr.trait_type, value: attr.value }),
  };
};

const assetTypes: AssetTypes = { vehicle, art, realEstate };

export default assetTypes;
