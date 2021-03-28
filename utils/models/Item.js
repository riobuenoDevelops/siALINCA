const itemSchema = {
	$id: "item",
	type: "object",
	properties: {
		_id: { $ref: "modelId#" },
		type: { type: "string" },
		quantity: { type: "integer" },
		unitQuantity: { type: "integer" },
		observations: { type: "string" },
		userId: { $ref: "user#/properties/_id" },
	},
	required: ["type", "quantity", "unitQuantity", "userId", "type"],
	additionalProperties: false,
};

const updatedItemSchema = {
	$id: "updateItem",
	type: "object",
	properties: {
		_id: { $ref: "modelId#" },
		type: { type: "string" },
		quantity: { type: "integer" },
		unitQuantity: { type: "integer" },
		observations: { type: "string" },
		userId: { $ref: "user#/properties/_id" },
	},
	additionalProperties: false,
};

module.exports = {
	itemSchema,
	updatedItemSchema,
};
