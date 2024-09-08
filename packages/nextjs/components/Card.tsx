import React from "react";
import { Image } from "@chakra-ui/react";
import styled from "styled-components";

interface CardProps {
  className?: string;
  align?: string;
  imageUrl?: string;
  children: React.ReactNode;
  title?: string;
  footer?: React.ReactNode;
}

const StyledCard = styled.div`
  .card-body {
    gap: 0;
  }
`;

const CustomCard: React.FC<CardProps> = ({ className, children, title, footer, align = "left", imageUrl }) => {
  return (
    <StyledCard className={`${className + " card bg-neutral text-neutral-content rounded-lg overflow-hidden"}`}>
      {imageUrl && <Image src={imageUrl} alt={"nft display"} />}
      <div className={`card-body items-${align}`}>
        {title && <h1 className="card-title">{title}</h1>}
        {children}
        {footer && (
          <div className="card-actions justify-end">
            <div className="divider w-full"></div>
            {footer}
          </div>
        )}
      </div>
    </StyledCard>
  );
};

export default CustomCard;
