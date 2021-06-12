const propertySchema = {
	$id: "property",
	type: "object",
	properties: {
		_id: { $ref: "modelId#" },
		itemId: { $ref: "item#/properties/_id" },
		description: { type: "string" },
		serial: { type: "string" },
		model: { type: "string" },
		mark: { type: "string" },
		material: { type: "string" },
		addressLine: { type: "string" },
		addressCountry: { type: "string" },
		addressCity: { type: "string" },
		addressState: { type: "string" },
		addressZipcode: { type: "string" },
	},
	required: [
		"itemId",
		"description",
		"serial",
		"model",
		"mark",
		"material",
	],
	additionalProperties: false,
};

const updatedPropertySchema = {
	$id: "updateProperty",
	type: "object",
	properties: {
		_id: { $ref: "modelId#" },
		itemId: { $ref: "item#/properties/_id" },
		description: { type: "string" },
		serial: { type: "string" },
		model: { type: "string" },
		mark: { type: "string" },
		material: { type: "string" },
		addressLine: { type: "string" },
		addressCountry: { type: "string" },
		addressCity: { type: "string" },
		addressState: { type: "string" },
		addressZipcode: { type: "string" },
	},
	additionalProperties: false,
};

module.exports = {
	propertySchema,
	updatedPropertySchema,
};
