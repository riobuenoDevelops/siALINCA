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
    isDeleted: { type: "boolean" },
    createdAt: { type: "string" }
  },
  required: [
    "name",
    "addressCity",
    "addressState",
    "addressCountry",
    "addressZipcode",
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
    isDeleted: { type: "boolean" },
    createdAt: { type: "string" }
  },
  additionalProperties: false,
};

module.exports = {
  sedeSchema,
  updatedSedeSchema,
};
