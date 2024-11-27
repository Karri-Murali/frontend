import { useCallback, useEffect, useReducer } from "react";

import "./Input.css";
import { validate } from "../../util/validators";

const inputReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE":
      return {
        ...state,
        value: action.val,
        isValid: validate(action.val, action.validators || []),
      };
    case "TOUCH":
      return {
        ...state,
        isTouched: true,
      };
    default:
      return state;
  }
};

const Input = (props) => {
  const [inputState, dispatch] = useReducer(inputReducer, {
    value: props.initialValue || "",
    isTouched: false,
    isValid: props.initialValid || false,
  });

  const {
    id,
    onInput,
    validators = [],
    element,
    type,
    placeholder,
    label,
    errorText,
    rows,
  } = props;

  const { value, isValid, isTouched } = inputState;

  useEffect(() => {
    onInput(id, value, isValid);
  }, [id, value, isValid, onInput]);

  const changeHandler = useCallback((event) => {
    dispatch({
      type: "CHANGE",
      val: event.target.value,
      validators: validators,
    });
  }, []);

  const touchHandler = useCallback(() => {
    dispatch({
      type: "TOUCH",
    });
  }, []);

  const inputElement =
    element === "input" ? (
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        onChange={changeHandler}
        onBlur={touchHandler}
        value={value}
      />
    ) : (
      <textarea
        id={id}
        type={type}
        placeholder={placeholder}
        onChange={changeHandler}
        onBlur={touchHandler}
        rows={rows || 3}
        value={value}
      />
    );
  return (
    <div
      className={`form-control ${
        !isValid && isTouched
          ? "form-control--invalid"
          : isValid && isTouched
          ? "form-control--valid"
          : ""
      }`}
    >
      <label htmlFor={id}>{label}</label>
      {inputElement}
      {!isValid && isTouched && <p>{errorText}</p>}
    </div>
  );
};

export default Input;
