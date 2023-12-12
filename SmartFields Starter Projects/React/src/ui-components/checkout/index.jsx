import React, { useEffect, useState, useReducer } from "react";
import "./style.css";
import Loader from "../loader";
import { addFields, loadFields } from "../../helpers/smart-fields-helper";
import cl from "classnames";
import { reducer, initialState } from "./reducer";

export default function CheckOut(props) {
  const [fieldsBrand, setFieldsBrand] = useState(false);
  const [state, dispatch] = useReducer(reducer, initialState);
  const [showValidations, setShowValidations] = useState({ name: false });
  const [isEditing, setIsEditing] = useState({ name: false });

  const setEmpty = (field, value) => {
    dispatch({ type: "set-empty", payload: { field, value } });
  };

  const setComplete = (field, value) => {
    dispatch({ type: "set-complete", payload: { field, value } });
  };

  const setErrors = (field, value) => {
    dispatch({ type: "set-errors", payload: { field, value } });
  };

  const setDlocalInstance = (dlocalInstance) => {
    dispatch({ type: "set-dlocal-instance", payload: dlocalInstance });
  };

  const setFields = (field, value) => {
    dispatch({ type: "set-fields", payload: { field, value } });
  };

  useEffect(() => {
    const smartFieldsConfig = {
      url: "https://js-sandbox.dlocal.com",
      country: "BR",
      api_key: "7a0f1cc1-b17b-4040-9032-f972cf599243",
    };

    addFields(
      () =>
        loadFields(
          smartFieldsConfig,
          false,
          setDlocalInstance,
          setFields,
          props.setLoading,
          setEmpty,
          setComplete,
          setErrors,
          setFieldsBrand
        ),
      smartFieldsConfig
    );
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    let hasErrors =
      state.errors.pan ||
      state.errors.expiration ||
      state.errors.cvv ||
      props.validate();

    if (state.empty.pan) {
      setErrors("pan", state.empty.pan);
      hasErrors = true;
    }
    if (state.empty.expiration) {
      setErrors("expiration", state.empty.expiration);
      hasErrors = true;
    }
    if (state.empty.cvv) {
      setErrors("cvv", state.empty.cvv);
      hasErrors = true;
    }

    if (
      hasErrors ||
      (!fieldsBrand && state.errors.pan) ||
      !state.complete.expiration ||
      !state.complete.cvv
    ) {
      return;
    }

    props.setLoading(true);
    state.dlocalInstance
      .createToken(state.fields.pan, {
        name: props.fieldsValues.name,
      })
      .then((response) => {
        const token = response.token;
        //pay with token
        props.onSubmit(token);
      })
      .catch((_) => {
        props.setLoading(false);
      });
  };

  const handleChange = (event) => {
    event.preventDefault();
    const { name, value } = event.target;
    const { fieldsValues } = props;
    const newFields = { ...fieldsValues, [name]: value };
    let newShowValidations = { ...showValidations, [name]: true };
    setShowValidations(newShowValidations);
    props.onChange(newFields);
  };

  const handleFocus = (event, focus) => {
    const { name } = event.target;
    let newIsEditing = { name: false };
    newIsEditing[name] = focus;
    setIsEditing(newIsEditing);
  };

  const reset = (event) => {
    event.preventDefault();
    var form = document.querySelector("form");
    form.reset();

    // Clear each Smart-Field.
    state.fields.pan.clear();
    state.fields.cvv.clear();
    state.fields.expiration.clear();

    props.onReset();
  };

  return (
    <div className="checkout">
      <div className="content">
        <form id="fields-form" onSubmit={handleSubmit}>
          <div className="fieldset">
            <div
              className={cl("overlay opaque", {
                visible: props.isLoading || props.success,
                hidden: !(props.isLoading || props.success),
              })}
            />
            <div
              id="loading-container"
              className={cl("container loader", {
                visible: props.isLoading,
                hidden: !props.isLoading,
              })}
            >
              <Loader color="blue" />
            </div>

            {props.success && (
              <div id="success-container" className={cl("container success")}>
                <div id="close-btn" onClick={(event) => reset(event)}>
                  X
                </div>
                <div className="tick-container" key="tick-container-paid">
                  <div className="trigger" />
                  <svg
                    version="1.1"
                    id="tick"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    xmlns="http://www.w3.org/2000/svg"
                    x="0px"
                    y="0px"
                    viewBox="0 0 37 37"
                    xmlSpace="preserve"
                  >
                    <path
                      className="circ path"
                      style={{
                        fill: "none",
                        stroke: "#8bc832",
                        strokeWidth: 3,
                        strokeLinejoin: "round",
                        strokeMiterlimit: 10,
                      }}
                      d="
                                M30.5,6.5L30.5,6.5c6.6,6.6,6.6,17.4,0,24l0,0c-6.6,6.6-17.4,6.6-24,0l0,0c-6.6-6.6-6.6-17.4,0-24l0,0C13.1-0.2,23.9-0.2,30.5,6.5z"
                    />
                    <polyline
                      className="tick path"
                      style={{
                        fill: "none",
                        stroke: "#8bc832",
                        strokeWidth: 3,
                        strokeLinejoin: "round",
                        strokeMiterlimit: 10,
                      }}
                      points="
                                11.6,20 15.9,24.2 26.4,13.8 "
                    />
                  </svg>
                </div>
                <p key="paragraph-paid">Thanks you for your payment.</p>
              </div>
            )}

            <legend className="title">Pay with credit card</legend>
            <div
              id="generalErrorContainer"
              className={cl({
                hasError: props.errors.general,
              })}
            >
              <div className="errorMsgContainer">
                <span id="expirationErrorMsg" className="error-tooltip">
                  There has been an error. Please try again.
                </span>
              </div>
            </div>

            <fieldset>
              <div
                id="fieldNameContainer"
                className={cl({
                  hasError:
                    props.errors["name"] &&
                    !isEditing.name &&
                    showValidations.name,
                })}
              >
                <div className="field">
                  <label>NAME</label>
                  <input
                    id="cardholder-name"
                    className="input"
                    type="text"
                    name="name"
                    placeholder="John Doe"
                    required={true}
                    onChange={(e) => handleChange(e)}
                    onFocus={(e) => handleFocus(e, true)}
                    onBlur={(e) => handleFocus(e, false)}
                    autoComplete="name"
                  />
                </div>
                <div className="errorMsgContainer">
                  <span id="nameErrorMsg" className="error-tooltip">
                    Please enter your name exactly as it appears on your card.
                  </span>
                </div>
              </div>
              <div
                id="fieldPanContainer"
                className={cl({ hasError: state.errors.pan })}
              >
                <div className="field">
                  <label>CARD NUMBER</label>
                  <div id="containerPan"></div>
                </div>
                <div className="errorMsgContainer">
                  <span id="panErrorMsg" className="error-tooltip">
                    {state.errors.pan && !state.empty.pan
                      ? "This credit card number is invalid"
                      : "Please enter your credit card number."}
                  </span>
                </div>
              </div>
              <div className="container">
                <div
                  id="fieldExpirationContainer"
                  className={cl("half", { hasError: state.errors.expiration })}
                >
                  <div className="field">
                    <label>EXPIRATION</label>
                    <div id="containerExpiration"></div>
                  </div>
                  <div className="errorMsgContainer">
                    <span id="expirationErrorMsg" className="error-tooltip">
                      {state.errors.expiration && !state.empty.expiration
                        ? "Invalid date"
                        : "Please enter your credit card expiration."}
                    </span>
                  </div>
                </div>
                <div
                  id="fieldCVVContainer"
                  className={cl("half", { hasError: state.errors.cvv })}
                >
                  <div className="field">
                    <label>SECURITY CODE</label>
                    {props.showCvvHelper && (
                      <div className="tooltipContainer">
                        <img
                          id="cvvTooltip"
                          alt="cvv"
                          className="tooltipImage"
                          src="https://static.dlocal.com/fields/test/assets/cc-input-icon/question.svg"
                        />

                        <div className="tooltipInner">
                          <img
                            className="tooltipInnerImage"
                            src="https://static.dlocal.com/facebook/cvv-help.png"
                          />
                        </div>
                      </div>
                    )}
                    <div id="containerCVV"></div>
                  </div>
                  <div className="errorMsgContainer">
                    <span id="cvvErrorMsg" className="error-tooltip">
                      {state.errors.cvv && !state.empty.cvv
                        ? "Invalid CVV."
                        : "Please enter your credit CVV."}
                    </span>
                  </div>
                </div>
              </div>
            </fieldset>
            <div className="actions">
              <button
                type="submit"
                id="form.pay_button"
                className="checkout-btn"
              >
                PAY
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
