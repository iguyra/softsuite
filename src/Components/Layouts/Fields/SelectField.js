import React, { useEffect, useState } from "react";
import Select from "react-select";

import { Label } from "reactstrap";

function SelectField(props) {
  return (
    <div className="form__group">
      <Label className="label">{props.label}</Label>

      <select
        disabled={props.disabled}
        className="select"
        name={props.name}
        // options={[{ label: "one", value: "1", name: "e" }]}
        placeholder={props.placeholder}
        {...props.register}
        multiple={props.isMulti}
      >
        {props.options.map((item) => {
          return <option value={+item.value}>{item.name}</option>;
        })}
      </select>
      {props.errors && props.errors[props.name] ? (
        <p className="fieldError">{props.errors[props.name].message}</p>
      ) : null}
    </div>
  );
}

export default SelectField;
