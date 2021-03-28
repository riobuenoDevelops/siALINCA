const mealSchema = {
	$id: "meal",
	type: "object",
	properties: {
		_id: { $ref: "modelId#" },
		itemId: { $ref: "item#/properties/_id" },
		description: { type: "string" },
		content: { type: "string" },
		expiratedDate: { type: "string" },
	},
	required: ["itemId", "description", "content", "expiratedDate"],
	additionalProperties: false,
};

const updatedMealSchema = {
	$id: "updateMeal",
	type: "object",
	properties: {
		_id: { $ref: "modelId#" },
		itemId: { $ref: "item#/properties/_id" },
		description: { type: "string" },
		content: { type: "string" },
		expiratedDate: { type: "string" },
	},
	additionalProperties: false,
};

module.exports = {
	mealSchema,
	updatedMealSchema,
};
