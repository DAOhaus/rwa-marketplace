import React from "react";
import { Alert, PageWrapper } from "~~/components";

const LoadingView = ({ error }: { error: string }) => {
  return (
    <PageWrapper>
      {error && (
        <>
          <div className="mb-4 mx-12 max-w-screen-lg">
            <Alert type="error" message={error} />
          </div>
        </>
      )}
      <div className="flex flex-col gap-4 w-80">
        <div className="skeleton h-48 w-full"></div>
        <div className="skeleton h-4 w-full"></div>
        <div className="skeleton h-4 w-full"></div>
      </div>
    </PageWrapper>
  );
};

export default LoadingView;
