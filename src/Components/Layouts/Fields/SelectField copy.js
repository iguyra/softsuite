import React from "react";

import { Label } from "reactstrap";

function SelectField(props) {
  return (
    <div className="form__group">
      <Label className="label">{props.label}</Label>

      <select
        disabled={props.disabled}
        className="select"
        name={props.name}
        onChange={(e) => {
          console.log(e.target.value);
          props.validation.setFieldValue(`${props.name}`, e.value);
        }}
        placeholder={props.placeholder}
        multiple={props.isMulti}
      >
        {props.options.map((item, i) => {
          return (
            <option key={i} value={+item.value}>
              {item.label}
            </option>
          );
        })}
      </select>
      {props.errors && props.errors[props.name] ? (
        <p className="fieldError">{props.errors[props.name].message}</p>
      ) : null}
    </div>
  );
}

export default SelectField;
