import React from "react";
import { Col, Input, Label, FormFeedback } from "reactstrap";

const TextField = (props) => {
  return (
    <Col md={props.md}>
      <div className="form__group">
        <Label className="label" htmlFor="product-title-input">
          {props.label}{" "}
          {props.optional && <span className="text-muted">(Optional)</span>}
        </Label>
        <Input
          type={props.type || "text"}
          name={props.name}
          className={`${props.inputClass} form-control`}
          value={props.value}
          onChange={props.onChange}
          onBlur={props.onBlur}
          invalid={
            props.validation.touched[props.name] &&
            props.validation.errors[props.name]
              ? true
              : false ||
                (props.errorMessage &&
                  props.errorMessage[props.name] &&
                  props.errorMessage[props.name].length)
              ? true
              : false
          }
          placeholder={props.placeholder || props.label}
          readOnly={props.readOnly}
        />
        {props.validation.touched[props.name] &&
        props.validation.errors[props.name] ? (
          <FormFeedback type="invalid">
            {props.validation.errors[props.name]}
          </FormFeedback>
        ) : null}
      </div>
    </Col>
  );
};

export default TextField;

// import React from "react";

// import { Label } from "reactstrap";

// function TextField(props) {
//   return (
//     <div className="form__group">
//       <Label className="label"> {props.label}</Label>

//       <input
//         className="select"
//         name={props.name}
//         placeholder={props.placeholder}
//         {...props.register}
//       />

//       {props.errors && props.errors[props.name] ? (
//         <p className="fieldError">{props.errors[props.name].message}</p>
//       ) : null}
//     </div>
//   );
// }

// export default TextField;
