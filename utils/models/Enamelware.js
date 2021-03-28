const enamelwareSchema = {
	$id: "enamelware",
	type: "object",
	properties: {
		_id: { $ref: "modelId#" },
		itemId: { $ref: "item#/properties/_id" },
		size: { type: "string" },
		material: { type: "string" },
	},
	required: ["itemId", "size", "material"],
	additionalProperties: false,
};

const updatedEnamelwareSchema = {
	$id: "updatedEnamelware",
	type: "object",
	properties: {
		_id: { $ref: "modelId#" },
		itemId: { $ref: "item#/properties/_id" },
		size: { type: "string" },
		material: { type: "string" },
	},
	additionalProperties: false,
};

module.exports = {
	enamelwareSchema,
	updatedEnamelwareSchema,
};
