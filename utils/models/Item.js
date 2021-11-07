const itemSchema = {
  $id: "item",
  type: "object",
  properties: {
    _id: { $ref: "modelId#" },
    name: { type: "string" },
    type: { type: "string" },
    itemChildId: { $ref: "modelId#" },
    quantity: { type: "integer" },
    unitQuantity: { type: "integer" },
    observations: { type: "string" },
    price: { type: "string" },
    userId: { $ref: "user#/properties/_id" },
    disabled: { type: "boolean" },
    isDeleted: { type: "boolean" },
    createdAt: { type: "string" }
  },
  required: ["type", "quantity", "unitQuantity", "userId"],
  additionalProperties: false,
};

const updatedItemSchema = {
  $id: "updateItem",
  type: "object",
  properties: {
    _id: { $ref: "modelId#" },
    name: { type: "string" },
    type: { type: "string" },
    itemChildId: { $ref: "modelId#" },
    quantity: { type: "integer" },
    unitQuantity: { type: "integer" },
    observations: { type: "string" },
    price: { type: "string" },
    userId: { $ref: "user#/properties/_id" },
    disabled: { type: "boolean" },
    isDeleted: { type: "boolean" },
    createdAt: { type: "string" }
  },
  additionalProperties: false,
};

module.exports = {
  itemSchema,
  updatedItemSchema,
};
