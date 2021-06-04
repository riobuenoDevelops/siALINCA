const sedeSchema = {
  $id: "sede",
  type: "object",
  properties: {
    _id: { $ref: "modelId#" },
    name: { type: "string" },
    addressLine: { type: "string" },
    addressCity: { type: "string" },
    addressState: { type: "string" },
    addressCountry: { type: "string" },
    addressZipcode: { type: "string" },
    disabled: { type: "boolean" },
    departments: {
      type: "array",
      minItems: 1,
      items: { type: "string" },
    },
  },
  required: [
    "name",
    "addressCity",
    "addressState",
    "addressCountry",
    "addressZipcode",
    "departments",
  ],
  additionalProperties: false,
};

const updatedSedeSchema = {
  $id: "updatedSede",
  type: "object",
  properties: {
    _id: { $ref: "modelId#" },
    name: { type: "string" },
    addressLine: { type: "string" },
    addressCity: { type: "string" },
    addressState: { type: "string" },
    addressCountry: { type: "string" },
    addressZipcode: { type: "string" },
    disabled: { type: "boolean" },
    departments: {
      type: "array",
      items: { type: "string" },
    },
  },
  additionalProperties: false,
};

module.exports = {
  sedeSchema,
  updatedSedeSchema,
};
