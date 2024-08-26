import React, { FC, ReactElement } from "react";
import { Button, ButtonProps } from "@chakra-ui/react";

interface Props extends ButtonProps {
  children: string | ReactElement;
}

const Loader: FC<Props> = ({ children, ...props }) => {
  return <Button {...props}>{children}</Button>;
};

export default Loader;
