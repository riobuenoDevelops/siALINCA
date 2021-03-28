const medicineSchema = {
	$id: "medicine",
	type: "object",
	properties: {
		_id: { $ref: "modelId#" },
		itemId: { $ref: "item#/properties/_id" },
		description: { type: "string" },
		content: { type: "string" },
		expiratedDate: { type: "string" },
		presentation: { type: "string" },
		markLab: { type: "string" },
	},
	required: [
		"itemId",
		"description",
		"content",
		"expiratedDate",
		"presentation",
		"markLab",
	],
	additionalProperties: false,
};

const updatedMedicineSchema = {
	$id: "updateMedicine",
	type: "object",
	properties: {
		_id: { $ref: "modelId#" },
		itemId: { $ref: "item#/properties/_id" },
		description: { type: "string" },
		content: { type: "string" },
		expiratedDate: { type: "string" },
		presentation: { type: "string" },
		markLab: { type: "string" },
	},
	additionalProperties: false,
};

module.exports = {
	medicineSchema,
	updatedMedicineSchema,
};
