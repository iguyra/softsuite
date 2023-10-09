import React, { useEffect, useState } from "react";

import { Label } from "reactstrap";

function RadioField(props) {
  return (
    <div className="form__group">
      <Label className="label">{props.label}</Label>

      <div className="radio-row">
        <input
          type="radio"
          className="select"
          name="category"
          options={[{ label: "one", value: "1", name: "e" }]}
          placeholder="select Element category..."
          id="category-input"
        />
        <span>{props.firstRadioName}</span>

        <input
          type="radio"
          className="select"
          name="category"
          options={[{ label: "one", value: "1", name: "e" }]}
          placeholder="select Element category..."
          id="category-input"
        />
        <span>{props.secondRadioName}</span>
      </div>
    </div>
  );
}

export default RadioField;
