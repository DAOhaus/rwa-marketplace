import { createThirdwebClient } from "thirdweb";
import { upload } from "thirdweb/storage";
import chainData from "~~/utils/chainData";

const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRD_WEB_CLIENT as string,
});

export const singleUpload = async (file: any, path?: string, onError?: ((arg0: string) => void) | undefined) => {
  // const uploadPath = (path || file.path) + '-' + Date.now();
  try {
    const uri: unknown = await upload({
      client,
      files: [file],
    });
    const urlOfUpload = `
      https://${process.env.NEXT_PUBLIC_THIRD_WEB_CLIENT}.ipfscdn.io/ipfs/${(uri as string).split("//")[1]}`;
    return urlOfUpload;
  } catch (err) {
    onError && onError(`Error uploading ${file.path}`);
    console.log(err);
    throw `error uploading ${file.path}, ${path} to IPFS`;
  }
};

export const doubleUpload = async (
  file: { name: string; type: string | string[] },
  metadata: any,
  onError: ((arg0: string) => void) | undefined,
) => {
  console.log("🚀 uploading file to IPFS with file & metadata:", file, metadata);
  const uploadPath = (metadata.name + "-" + file.name).replace(/\s+/g, "");
  const uploadHash = await singleUpload(file, uploadPath, onError);
  console.log(`🚀 uploaded file to IPFS: ${uploadHash}`);
  const isPdf = file.type.includes("pdf");
  if (isPdf) {
    metadata.attributes.push({ trait_type: chainData.linkedPdfKey, value: chainData.baseIPFSUrl + uploadHash });
  } else {
    metadata.image = chainData.baseIPFSUrl + uploadHash;
  }
  // upload metadata to IPFS
  console.log("🚀 uploading metadata", metadata);
  const metadataHash = await singleUpload(JSON.stringify(metadata), uploadPath + "-metadata", onError);
  console.log(`🚀 uploaded metadata to IPFS: ${metadataHash}`);
  return { metadataHash, fileHash: uploadHash };
};

export default doubleUpload;
