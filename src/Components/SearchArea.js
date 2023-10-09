import React, { useEffect, useState } from "react";
import Search from "./Search";
import Switch from "./Modules/Switch";

function SearchArea() {
  return (
    <div className="searcharea__container">
      {/* <div className="org-details">
        <img src="/house.png" alt="" />
        <div className="">
          <p>CHange organization</p>
          <span>PaperSoft Limited</span>
        </div>

        <img src="/Iconly.png" alt="" />
      </div> */}
      <Switch name="Change organization" iconPath={"/house.png"} />

      <Search />
    </div>
  );
}

export default SearchArea;
