// interface Attribute {
//     trait_type: string;
//     value: string;
// }
// interface AttributeDetails {
//     required: boolean;
//     inputType: string;
//     defaultValue: any;
// }
export interface Nft {
  name: string;
  description: string;
  image: string;
  external_url: string; // for pdf file
  attributes: {
    trait_type: string;
    value: string;
  }[];
}
export interface Asset {
  nft: Nft;
  attributeDetails: {
    required: boolean;
    inputType: string;
    defaultValue: any;
  }[];
  category: string;
  id: bigint;
  receipt: any;
}

export const art: Asset = {
  nft: {
    description: "",
    image: "",
    name: "",
    external_url: "",
    attributes: [
      // change the values?
      { trait_type: "title", value: "Title" },
      { trait_type: "artist", value: "Artist" },
      { trait_type: "year created", value: "" },
      { trait_type: "medium", value: "" },
      { trait_type: "dimensions", value: "" },
    ],
  },
  attributeDetails: [
    // change the defaultValues?
    { required: true, inputType: "text", defaultValue: "Title" },
    { required: true, inputType: "text", defaultValue: "Artist" },
    { required: false, inputType: "number", defaultValue: "0" },
    { required: false, inputType: "text", defaultValue: "" },
    { required: false, inputType: "text", defaultValue: "" },
  ],
  category: "art",
  id: BigInt(0),
  receipt: {},
};
export const realEstate: Asset = {
  nft: {
    description: "",
    image: "",
    name: "",
    external_url: "",
    attributes: [
      { trait_type: "address", value: "" },
      { trait_type: "property_type", value: "" },
      { trait_type: "square_footage", value: "" },
      { trait_type: "year_built", value: "" },
      { trait_type: "bedrooms", value: "" },
      { trait_type: "bathrooms", value: "" },
    ],
  },
  attributeDetails: [
    { required: true, inputType: "text", defaultValue: "" },
    { required: true, inputType: "text", defaultValue: "" },
    { required: false, inputType: "number", defaultValue: "0" },
    { required: false, inputType: "number", defaultValue: "0" },
    { required: false, inputType: "number", defaultValue: "0" },
    { required: false, inputType: "number", defaultValue: "0" },
  ],
  category: "realEstate",
  id: BigInt(0),
  receipt: {},
};
export const car: Asset = {
  nft: {
    description: "",
    image: "",
    name: "",
    external_url: "",
    attributes: [
      { trait_type: "model", value: "" },
      { trait_type: "make", value: "" },
      { trait_type: "year", value: "" },
      { trait_type: "color", value: "" },
      { trait_type: "mileage", value: "" },
    ],
  },
  attributeDetails: [
    { required: true, inputType: "text", defaultValue: "" },
    { required: true, inputType: "text", defaultValue: "" },
    { required: true, inputType: "number", defaultValue: "0" },
    { required: false, inputType: "text", defaultValue: "" },
    { required: false, inputType: "number", defaultValue: "0" },
  ],
  category: "car",
  id: BigInt(0),
  receipt: {},
};
