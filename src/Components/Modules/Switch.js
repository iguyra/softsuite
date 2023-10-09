import { useState } from "react";

function Switch({ name, list, iconPath }) {
  return (
    <div className="org-details">
      <img src={iconPath} alt="" />

      <div className="org-details__middle">
        <p>{name}</p>
        <span>PaperSoft Limited</span>
      </div>

      <img src="/Iconly.png" alt="" />
    </div>
  );
}

export default Switch;
