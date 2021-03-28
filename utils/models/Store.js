const storeSchema = {
	$id: "store",
	type: "object",
	properties: {
		_id: { $ref: "modelId#" },
		name: { type: "string" },
		addressLine: { type: "string" },
		addressCity: { type: "string" },
		addressState: { type: "string" },
		addressCountry: { type: "string" },
		addressZipcode: { type: "string" },
		items: {
			type: "array",
			items: {
				type: "object",
				properties: {
					itemId: { $ref: "item#/properties/_id" },
					quantity: { type: "integer" },
				},
			},
		},
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

const updatedStoreSchema = {
	$id: "updateStore",
	type: "object",
	properties: {
		_id: { $ref: "modelId#" },
		name: { type: "string" },
		addressLine: { type: "string" },
		addressCity: { type: "string" },
		addressState: { type: "string" },
		addressCountry: { type: "string" },
		addressZipcode: { type: "string" },
		items: {
			type: "array",
			items: {
				type: "object",
				properties: {
					itemId: { $ref: "item#/properties/_id" },
					quantity: { type: "integer" },
				},
			},
		},
	},
	additionalProperties: false,
};

module.exports = {
	storeSchema,
	updatedStoreSchema,
};
