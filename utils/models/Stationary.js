const stationarySchema = {
	$id: "stationary",
	type: "object",
	properties: {
		_id: { $ref: "modelId#" },
		itemId: { $ref: "item#/properties/_id" },
		mark: { type: "string" },
		presentation: { type: "string" },
	},
	required: ["itemId", "mark", "presentation"],
	additionalProperties: false,
};

const updatedStationarySchema = {
	$id: "updatedStationary",
	type: "object",
	properties: {
		_id: { $ref: "modelId#" },
		itemId: { $ref: "item#/properties/_id" },
		mark: { type: "string" },
		presentation: { type: "string" },
	},
	additionalProperties: false,
};

module.exports = {
	stationarySchema,
	updatedStationarySchema,
};
