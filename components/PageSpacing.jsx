import React from "react";

function PageSpacing({ children, className = "" }) {
  return (
    <div className={`w-full min-w-0 my-0 ${className}`}>
      {children}
    </div>
  );
}

export default PageSpacing;