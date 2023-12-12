import validator from "validator";

export function required(txt) {
  return txt !== undefined && !validator.isEmpty(txt);
}

export function validateData(validations, data) {
  return Object.keys(validations).reduce((obj, key) => {
    const reverseArray = reverseArr(validations[key]);
    for (var idx in reverseArray) {
      const validate = reverseArray[idx].fn;
      if (!validate(data[key])) {
        obj[key] = reverseArray[idx].msg;
      }
    }
    return obj;
  }, {});
}

function reverseArr(input) {
  var ret = [];
  for (var i = input.length - 1; i >= 0; i--) {
    ret.push(input[i]);
  }
  return ret;
}

export function clean_document(document) {
  return document.replace(/\D/g, "");
}
