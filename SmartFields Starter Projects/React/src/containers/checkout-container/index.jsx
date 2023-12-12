import React, { useState } from "react";
import configuration from "./fieldsconfig";
import Checkout from "../../ui-components/checkout";
import { executePayment } from "../../services";
import * as validators from "../../helpers/validators";

export default function CheckoutContainer() {
  const [isLoading, setIsLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({
    name: false,
    general: false,
    pan: false,
    cvv: false,
    expiration: false,
  });
  const [fieldsValues, setFieldsValues] = useState({ name: "" });

  const handleChange = (fieldsValues) => {
    const errors = validators.validateData(
      configuration.validators,
      fieldsValues
    );
    setErrors(errors);
    setFieldsValues(fieldsValues);
  };

  const handleSubmit = async (smartFieldsToken) => {
    try {
      setIsLoading(true);
      if (smartFieldsToken) {
        const { data } = await executePayment({
          smartFieldsToken,
          name: fieldsValues.name,
        });
        setSuccess(true);
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      setErrors({ ...errors, general: error });
      throw error;
    }
  };

  const validate = () => {
    const errors = validators.validateData(
      configuration.validators,
      fieldsValues
    );

    let hasErrors = false;
    setErrors(errors);

    configuration.fields.forEach((field) => {
      if (errors[field.name]) {
        hasErrors = true;
      }
    });

    return hasErrors;
  };

  const onReset = () => {
    setIsLoading(false);
    setSuccess(false);
    setErrors({
      name: false,
      general: false,
      pan: false,
      cvv: false,
      expiration: false,
    });
    setFieldsValues({ name: "" });
  };

  return (
    <Checkout
      hideIcon={true}
      showCvvHelper={true}
      errors={errors}
      validate={validate}
      onSubmit={handleSubmit}
      onChange={handleChange}
      onReset={onReset}
      setLoading={setIsLoading}
      isLoading={isLoading}
      fieldsConfig={configuration}
      fieldsValues={fieldsValues}
      success={success}
    />
  );
}
