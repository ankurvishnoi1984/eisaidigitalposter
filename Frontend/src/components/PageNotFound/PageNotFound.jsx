import React from "react";
import './PageNotFound.css'
const PageNotFound = () => {
  return (
    <div className="not-found-container">
      <h1 className="not-found-header">404</h1>
      <p className="not-found-text">
        Oops! The page you're looking for doesn't exist.
      </p>
    </div>
  );
};

export default PageNotFound;
