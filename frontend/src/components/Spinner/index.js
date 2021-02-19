import React from "react";

const Spinner = () => {
  return (
    <div className="spinner-container">
      <div className="lds-ring">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

export default Spinner;
