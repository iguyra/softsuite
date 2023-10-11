import React from "react";

import { Label } from "reactstrap";

function RadioField(props) {
  return (
    <div className="form__group">
      <Label className="label">{props.label}</Label>

      <div className="radio-row">
        <input
          type="radio"
          className="select"
          name={props.name}
          {...props.register}
          defaultValue={props.firstRadioName}
        />
        <span>{props.firstRadioName}</span>

        <input
          type="radio"
          className="select"
          name={props.name}
          {...props.register}
          defaultValue={props.secondRadioName}
        />
        <span>{props.secondRadioName}</span>
      </div>

      <p>{props.errors[props.name] && props.errors[props.name].message}</p>
    </div>
  );
}

export default RadioField;
