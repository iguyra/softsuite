import React from "react";

import { Label } from "reactstrap";

function SelectField(props) {
  return (
    <div className="form__group">
      <Label className="label">{props.label}</Label>

      <select
        disabled={props.disabled}
        className="select"
        value={props.value}
        name={props.name}
        onChange={(e) => {
          console.log(e.target.value, "EVALL");
          props.validation.setFieldValue(`${props.name}`, e.target.value);
        }}
        placeholder={props.placeholder}
        multiple={props.isMulti}
        options={props?.options}
      >
        {props.options.map((item, i) => {
          return (
            <option key={i} value={item.value}>
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
