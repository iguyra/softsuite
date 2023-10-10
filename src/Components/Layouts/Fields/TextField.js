import React from "react";

import { Label } from "reactstrap";

function TextField(props) {
  return (
    <div className="form__group">
      <Label className="label"> {props.label}</Label>

      <input
        className="select"
        name={props.name}
        placeholder={props.placeholder}
        {...props.register}
      />

      {props.errors && props.errors[props.name] ? (
        <p className="fieldError">{props.errors[props.name].message}</p>
      ) : null}
    </div>
  );
}

export default TextField;
