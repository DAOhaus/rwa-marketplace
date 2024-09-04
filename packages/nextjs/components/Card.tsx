import React from "react";
import styled from "styled-components";

interface CardProps {
  className?: string;
  children: React.ReactNode;
}

const StyledCard = styled.div`
  .css-selector: "attribute";
`;

const CustomCard: React.FC<CardProps> = ({ className, children }) => {
  // return (
  //   <StyledCard
  //     <div className="card-body">{children}</div>
  //   </StyledCard>
  // );
  return (
    <StyledCard className={`${className || "card bg-neutral text-neutral-content"}`}>
      <div className="card-body items-center text-center">
        <h2 className="card-title">Cookies!</h2>
        {children}
        <div className="card-actions justify-end">
          <button className="btn btn-primary">Accept</button>
          <button className="btn btn-ghost">Deny</button>
        </div>
      </div>
    </StyledCard>
  );
  // return (
  //   <StyledCard className={`${className || ""}`}>
  //     <CardHeader>Header</CardHeader>
  //     <CardBody>{children}</CardBody>
  //     <CardFooter>Footer</CardFooter>
  //   </StyledCard>
  // );
};

export default CustomCard;
