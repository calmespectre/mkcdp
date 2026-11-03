import React from "react";

function PageSpacing({ children, className = "" }) {
  return (
    <div className={`w-full min-w-0 pt-22 ${className}`}>
      {children}
    </div>
  );
}

export default PageSpacing;