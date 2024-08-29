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
}

export const art: Asset = {
  nft: {
    description: "",
    image: "",
    name: "",
    external_url: "",
    attributes: [
      { trait_type: "title", value: "" },
      { trait_type: "artist", value: "" },
      { trait_type: "year created", value: "" },
      { trait_type: "medium", value: "" },
      { trait_type: "dimensions", value: "" },
    ],
  },
  attributeDetails: [
    { required: true, inputType: "text", defaultValue: "" },
    { required: true, inputType: "text", defaultValue: "" },
    { required: false, inputType: "number", defaultValue: "0" },
    { required: false, inputType: "text", defaultValue: "" },
    { required: false, inputType: "text", defaultValue: "" },
  ],
  category: "art",
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
};
