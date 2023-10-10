import React, { useEffect, useState } from "react";

import { Label } from "reactstrap";

function ToggleField(props) {
  return (
    <div className="form__group">
      <Label className="label">Status</Label>

      <div className="radio-row">
        <label className="switch">
          <input
            type="checkbox"
            className="select"
            name={props.name}
            placeholder={props.placeholder}
            {...props.register}
          ></input>
          <span className="slider"></span>
        </label>
        Active
      </div>
    </div>
  );
}

export default ToggleField;
