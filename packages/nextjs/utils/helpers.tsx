//TODO: bring over nftInterface
// import { nftInterface } from "./store/store";
import { formatEther } from "viem";

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

export function getAttribute(string: string, attributes: Array<{ trait_type: string; value: string }>) {
  if (!attributes || attributes.length === 0) return;
  return attributes?.find((attribute: { trait_type: string; value: string }) => {
    if (attribute.trait_type?.toLowerCase && string?.toLowerCase) {
      return attribute.trait_type.toLowerCase() === string.toLowerCase();
    }
  });
}

// export function mapNftData(nftData: nftInterface) {
//   return {
//     description: nftData.description,
//     external_url: nftData.external_url,
//     image: nftData.imageUrl,
//     name: nftData.name,
//     attributes: nftData.attributes,
//   };
// }
