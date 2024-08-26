import React, { FC } from "react";

interface Props {
  type?: string;
  height?: "10" | "20" | "40" | "96";
}

const Loader: FC<Props> = ({ type = "spinner", height = "32" }) => {
  const BlockLoader = <div className={`skeleton h-${height} w-full`}></div>;
  if (type === "block") return BlockLoader;
  if (type === "spinner")
    return (
      <span className="z-20 loading loading-spinner loading-lg absolute m-auto left-0 right-0 top-0 bottom-0"></span>
    );
};

export default Loader;
