export function addFields(loadFields, smartFieldsConfig) {
  var s = document.createElement("script");
  s.setAttribute("src", smartFieldsConfig.url);
  s.onload = loadFields;
  document.body.appendChild(s);
}

export function loadFields(
  smartFieldsConfig,
  hideIcon,
  setDlocalInstance,
  setFields,
  setLoading,
  setEmpty,
  setComplete,
  setErrors,
  setHasBrand
) {
  let panLoaded = false;
  let cvvLoaded = false;
  let expirationLoaded = false;

  const today = new Date();
  const month = today.getMonth() + 1;
  const monthStr = month <= 9 ? "0" + month : month.toString();
  const year = (today.getFullYear() + 2).toString().substring(2);

  // eslint-disable-next-line no-undef
  const dlocalInstance = dlocal(smartFieldsConfig.api_key);
  setDlocalInstance(dlocalInstance);

  const smartfieldsInstance = dlocalInstance.fields({
    fonts: [
      {
        cssSrc: "https://rsms.me/inter/inter-ui.css",
      },
    ],
    locale: "es",
    country: smartFieldsConfig.country,
  });

  const panField = smartfieldsInstance.create("pan", {
    style: {
      base: {
        fontSize: "16px",
        fontFamily: "Roboto, Quicksand, Open Sans, Segoe UI, sans-serif",
        lineHeight: "18px",
        fontSmoothing: "antialiased",
        fontWeight: "500",
        color: "#666",
        "::placeholder": {
          color: "#c1c1c1",
        },
        iconColor: "#c1c1c1",
      },
      invalid: {
        color: "#ff2e50",
      },
      autofilled: {
        color: "#000000",
      },
    },
    placeholder: "",
    hideIcon: hideIcon,
  });

  const cvvField = smartfieldsInstance.create("cvv", {
    style: {
      base: {
        fontSize: "16px",
        fontFamily: "Roboto, Quicksand, Open Sans, Segoe UI, sans-serif",
        lineHeight: "18px",
        fontSmoothing: "antialiased",
        fontWeight: "500",
        color: "#666",
        "::placeholder": {
          color: "#c1c1c1",
        },
      },
    },
    invalid: {
      color: "#ff2e50",
    },
    placeholder: "",
  });

  const expirationField = smartfieldsInstance.create("expiration", {
    style: {
      base: {
        fontSize: "16px",
        fontFamily: "Roboto, Quicksand, Open Sans, Segoe UI, sans-serif",
        lineHeight: "18px",
        fontSmoothing: "antialiased",
        fontWeight: "500",
        color: "#666",
        "::placeholder": {
          color: "#c1c1c1",
        },
      },
      invalid: {
        color: "#ff2e50",
      },
      autofilled: {
        color: "#000000",
      },
    },
    placeholder: monthStr + "/" + year,
  });

  panField.on("complete", function (event) {
    setComplete("pan", event.complete);
  });

  expirationField.on("complete", function (event) {
    setComplete("expiration", event.complete);
  });

  cvvField.on("complete", function (event) {
    setComplete("cvv", event.complete);
  });

  panField.on("brand", function (event) {
    setHasBrand(!!event.brand);
  });

  panField.on("ready", function () {
    panLoaded = true;
    if (panLoaded && cvvLoaded && expirationLoaded) {
      setLoading(false);
    }
  });

  expirationField.on("ready", function () {
    expirationLoaded = true;
    if (panLoaded && cvvLoaded && expirationLoaded) {
      setLoading(false);
    }
  });

  cvvField.on("ready", function () {
    cvvLoaded = true;
    if (panLoaded && cvvLoaded && expirationLoaded) {
      setLoading(false);
    }
  });

  panField.on("blur", function (event) {
    setEmpty("pan", event.empty);
    setErrors("pan", event.error);
  });

  expirationField.on("blur", function (event) {
    setEmpty("expiration", event.empty);
    setErrors("expiration", event.error);
  });

  cvvField.on("blur", function (event) {
    setEmpty("cvv", event.empty);
    setErrors("cvv", event.error);
  });

  panField.on("change", function (event) {
    setErrors("pan", event.error);
  });

  expirationField.on("change", function (event) {
    setErrors("expiration", event.error);
  });

  cvvField.on("change", function (event) {
    setErrors("cvv", event.error);
  });

  panField.mount(document.getElementById("containerPan"));
  expirationField.mount(document.getElementById("containerExpiration"));
  cvvField.mount(document.getElementById("containerCVV"));

  setFields("pan", panField);
  setFields("expiration", expirationField);
  setFields("cvv", cvvField);
}
