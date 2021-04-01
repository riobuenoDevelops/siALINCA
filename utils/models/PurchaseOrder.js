const purchaseOrderSchema = {
	$id: "purchaseOrder",
	type: "object",
	properties: {
		_id: { $ref: "modelId#" },
		date: { $ref: "string" },
		currency: { type: "string" },
		totalPrice: { type: "number" },
		disabled: { type: "boolean" },
		bills: {
			type: "array",
			minItems: 1,
			items: {
				type: "string",
			},
		},
		items: {
			type: "array",
			minItems: 1,
			items: {
				type: "object",
				properties: {
					itemId: { $ref: "item#/properties/_id" },
					quantity: { type: "integer" },
					price: { type: "number" },
				},
			},
		},
	},
	required: ["date", "currency", "totalPrice", "bills", "items"],
	additionalProperties: false,
};

const updatedPurchaseOrderSchema = {
	$id: "updatePurchaseOrder",
	type: "object",
	properties: {
		_id: { $ref: "modelId#" },
		date: { $ref: "string" },
		currency: { type: "string" },
		totalPrice: { type: "number" },
		disabled: { type: "boolean" },
		bills: {
			type: "array",
			minItems: 1,
			items: {
				type: "string",
			},
		},
		items: {
			type: "array",
			items: {
				type: "object",
				properties: {
					itemId: { $ref: "item#/properties/_id" },
					quantity: { type: "integer" },
					price: { type: "number" },
				},
			},
		},
	},
	additionalProperties: false,
};

module.exports = {
	purchaseOrderSchema,
	updatedPurchaseOrderSchema,
};
