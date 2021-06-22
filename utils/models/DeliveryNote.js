const deliveryNoteSchema = {
	$id: "deliveryNote",
	type: "object",
	properties: {
		_id: { $ref: "modelId#" },
		createStamp: { type: "string" },
		returnStamp: { type: "string" },
		noteType: { type: "string" },
		applicantType: { type: "string" },
		applicantId: { $ref: "modelId#" },
		disabled: { type: "boolean" },
		items: {
			minItems: 1,
			type: "array",
			items: {
				type: "object",
				properties: {
					storeId: { $ref: "store#/properties/_id" },
					itemId: { $ref: "item#/properties/_id" },
					quantity: { type: "integer" },
				},
			},
		},
	},
	required: [
		"createStamp",
		"returnStamp",
		"noteType",
		"applicantType",
		"applicantId",
		"items",
		"disabled"
	],
	additionalProperties: false,
};

const updatedDeliveryNoteSchema = {
	$id: "updateDeliveryNote",
	type: "object",
	properties: {
		_id: { $ref: "modelId#" },
		createStamp: { type: "string" },
		returnStamp: { type: "string" },
		noteType: { type: "string" },
		applicantType: { type: "string" },
		applicantId: { $ref: "modelId#" },
		disabled: { type: "boolean" },
		items: {
			type: "array",
			items: {
				type: "object",
				properties: {
					storeId: { $ref: "store#/properties/_id" },
					itemId: { $ref: "item#/properties/_id" },
					quantity: { type: "integer" },
				},
			},
		},
	},
	additionalProperties: false,
};

module.exports = {
	deliveryNoteSchema,
	updatedDeliveryNoteSchema,
};
