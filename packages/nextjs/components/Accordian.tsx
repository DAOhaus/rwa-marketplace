import React, { FC, ReactNode } from "react";

interface Props {
  title: ReactNode | string;
  className?: string;
  children: ReactNode;
  onClick?: () => void;
}

const Accordian: FC<Props> = ({ title, children, onClick, className = "" }) => {
  const classes = className + "bg-base-100 collapse collapse-arrow shadow-md overflow-hidden";
  return (
    <div className={classes} onClick={onClick}>
      <input type="checkbox" />
      <div className="collapse-title text-large font-medium pl-12 flex justify-center items-start">
        <div className="flex flex-row">{title}</div>
      </div>
      <div className="collapse-content overflow-hidden">{children}</div>
    </div>
  );
};

export default Accordian;
