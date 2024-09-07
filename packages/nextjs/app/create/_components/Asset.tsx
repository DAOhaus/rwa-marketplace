// TODO: combine attributeData into the attributes themselves and provider a function to remove unused fields from attribute to be used before saving
export interface Nft {
  name: string;
  description: string;
  image: string;
  attributes: {
    trait_type: string;
    value: string;
    placeholder?: string;
    inputType?: string;
    required?: boolean;
  }[];
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
      // change the values?
      { trait_type: "title", value: "", placeholder: "Title" },
      { trait_type: "artist", value: "", placeholder: "Artist" },
      { trait_type: "year", inputType: "number", value: "", placeholder: "1999" },
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
      { trait_type: "address", value: "" },
      { trait_type: "property_type", value: "" },
      { trait_type: "square_footage", value: "" },
      { trait_type: "year_built", value: "" },
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
      { trait_type: "model", value: "", placeholder: "G Wagon" },
      { trait_type: "make", value: "", placeholder: "Mercedes" },
      { trait_type: "year", value: "", inputType: "number", placeholder: "2020" },
      { trait_type: "color", value: "", placeholder: "White" },
      { trait_type: "mileage", value: "", inputType: "number", placeholder: "100000" },
    ],
  },
  category: "vehicle",
  id: BigInt(0),
  receipt: {},
};

export const sanitizeNft = (nft: Nft) => {
  return {
    ...nft,
    attributes: nft.attributes.map(attr => ({ trait_type: attr.trait_type, value: attr.value })),
  };
};

const assetTypes: AssetTypes = { vehicle, art, realEstate };

export default assetTypes;
