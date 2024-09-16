//TODO: bring over nftInterface
// import { nftInterface } from "./store/store";
import { formatEther } from "viem";
import { Attribute } from "~~/types/Asset";

export const format = (
  value: any,
  options?: { isCurrency?: any; from18?: any; to18?: boolean; returnNumber?: boolean } | undefined,
) => {
  if (!value) return;
  let formattedValue = value;

  if (options?.to18) {
    formattedValue = String(formattedValue) + "000000000000000000";
  }

  // 0-50 => 26.24
  if (Number(formattedValue) < 50 && Number(formattedValue) > 1) {
    formattedValue = Number(formattedValue)?.toFixed(2);
  }
  // 100000000000000000000000000 => 10000000
  if (options?.from18) {
    formattedValue = formatEther(BigInt(formattedValue));
  }
  //  1 => 10000000000000000000

  // Add commas and $ => 1,000 || $1,000
  if (!options?.returnNumber && (formattedValue > 999 || options?.isCurrency)) {
    formattedValue = Intl.NumberFormat("en-US", {
      ...(options?.isCurrency && { style: "currency", currency: "USD" }),
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Number(formattedValue));
  }
  // .000456
  if (formattedValue < 1) {
    formattedValue = Intl.NumberFormat("en-US", {
      ...(options?.isCurrency && { style: "currency", currency: "USD" }),
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    }).format(Number(formattedValue));
  }
  if (options?.returnNumber) {
    formattedValue = Number(formattedValue);
  }
  return formattedValue;
};

export function createAttribute(key: string, value: any) {
  if (!key || !value) return;
  return { trait_type: key, value: value };
}

export const cleanAttributes = (attributes: Attribute[], duplicateString: string) =>
  (attributes || []).filter((att: { trait_type: string }) => att.trait_type != duplicateString);

// Function to update or add an attribute in the attributes array
export function updateAttributes(attributes: Attribute[], key: string, value: any) {
  // Check if the key already exists in the attributes
  const index = attributes.findIndex(att => att.trait_type === key);

  if (index !== -1) {
    // If key is found, update the existing value
    attributes[index].value = value;
  } else {
    // If key is not found, create a new attribute and add it
    const newAttribute = createAttribute(key, value);
    if (newAttribute) {
      attributes.push(newAttribute);
    }
  }

  return attributes;
}

export function groupByKeyValue(obj: any, customAttributes?: any) {
  const result: any = [];
  for (const key in obj) {
    try {
      const [keyIndex, keyName] = key.split(":");
      if (result[keyIndex]) {
        result[keyIndex] = { ...result[keyIndex], [keyName]: obj[key] };
      } else if (keyName) {
        result[keyIndex] = { [keyName]: obj[key] };
      }
    } catch (error) {
      return;
    }
  }
  if (customAttributes) {
    const filteredAttributes = customAttributes.filter((attr: object) => attr);
    result.push(...filteredAttributes);
  }
  return result;
}

export const shortenHash = (hash: string) => {
  if (!hash) return;
  return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
};

export function getAttribute(string: string, attributes: Attribute[]) {
  if (!attributes || attributes.length === 0) return;
  return attributes?.find((attribute: Attribute) => {
    if (attribute.trait_type?.toLowerCase && string?.toLowerCase) {
      return attribute.trait_type.toLowerCase() === string.toLowerCase();
    }
  });
}

export const jsonToStringSafe = (e: any) => {
  let returnString;
  try {
    returnString = JSON.stringify(e, (_, value) => (typeof value === "bigint" ? value.toString() : value));
  } catch (error) {
    console.log("error converting json to string");
    console.error(error);
  }
  return returnString;
};

export const stringToJsonSafe = (e: any) => {
  let returnJson;
  try {
    returnJson = JSON.parse(e);
  } catch (error) {
    console.log("error converting string to json");
    console.error(error);
  }
  return returnJson;
};

export const ipfsToJsonSafe = async (url: any) => {
  try {
    async function getData() {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      return await response.json();
    }
    await getData();
  } catch (error) {
    console.log("error converting ipfs url to json");
    console.error(error);
  }
};
