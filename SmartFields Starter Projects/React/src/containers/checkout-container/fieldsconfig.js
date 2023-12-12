import * as validators from "../../helpers/validators";

const fieldsConfig = {
  fields: [{
    name: "name",
    placeholder: "John Doe",
    label: "NAME",
  }, ],
  validators: {
    "name": [{
      fn: validators.required,
      msg: "Please enter your name exactly as it appears on your card.",
    }, ],
  },
};

export default fieldsConfig;