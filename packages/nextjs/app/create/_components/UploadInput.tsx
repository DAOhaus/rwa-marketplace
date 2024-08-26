import React, { createRef } from "react";
import { Box, Flex } from "@chakra-ui/react";
import { useDropzone } from "react-dropzone";
import { DocumentCheckIcon, DocumentIcon, PhotoIcon } from "@heroicons/react/24/outline";
import { Loader, Text } from "~~/components";

const UploadInput = ({
  onDrop,
  loading,
  success,
  acceptedFileType = "*",
  height = "20vh",
  type = "image",
  ...props
}: {
  onDrop: (event: any) => Promise<void>;
  loading?: boolean;
  success?: boolean;
  height?: string;
  acceptedFileType?: string;
  type?: string;
  props?: any;
}) => {
  const { getRootProps, getInputProps } = useDropzone({ onDrop });
  const dropZoneRef: React.LegacyRef<HTMLDivElement> | undefined = createRef();
  const iconMap: { [key: string]: any } = {
    image: <PhotoIcon className="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />,
    pdf: <DocumentIcon className="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />,
    success: <DocumentCheckIcon className="mx-auto h-12 w-12 text-teal" aria-hidden="true" />,
  };
  return (
    <Box>
      <input {...getInputProps()} style={{ display: "none" }} onChange={onDrop} type="file" accept={acceptedFileType} />
      <Flex
        w="full"
        {...getRootProps()}
        cursor="pointer"
        ref={dropZoneRef}
        backdropFilter="blur(20px)"
        border="2px dashed gray"
        rounded="10px"
        minH={height}
        bg="rgba(255, 255, 255, 0.09)"
        direction="column"
        transitionDuration="300ms"
        alignItems="center"
        // background="var(--chakra-colors-chakra-body-bg)"
        background={"bg-base-200"}
        _hover={{ background: "blackAlpha.100" }}
        justify="center"
        {...props}
      >
        {loading ? (
          <Loader />
        ) : (
          <>
            {success ? (
              iconMap["success"]
            ) : (
              <>
                {iconMap[type]}
                <Text fontWeight="normal">{type === "pdf" ? "Upload Document" : "Upload Image"}</Text>
              </>
            )}
          </>
        )}
      </Flex>
    </Box>
  );
};

export default UploadInput;
