const electroDeviceSchema = {
	$id: "electroDevice",
	type: "object",
	properties: {
		_id: { $ref: "modelId#" },
		itemId: { $ref: "item#/properties/_id" },
		deviceType: { type: "string" },
		mark: { type: "string" },
		model: { type: "string" },
		charancteristics: {
			minItems: 1,
			type: "array",
			items: {
				type: "object",
				properties: {
					name: { type: "string" },
					value: { type: "string" },
				},
			},
		},
	},
	required: ["itemId", "deviceType", "mark", "model", "characteristics"],
	additionalProperties: false,
};

const updatedElectorDeviceSchema = {
	$id: "updatedElectroDevice",
	type: "object",
	properties: {
		_id: { $ref: "modelId#" },
		itemId: { $ref: "item#/properties/_id" },
		deviceType: { type: "string" },
		mark: { type: "string" },
		model: { type: "string" },
		charancteristics: {
			type: "array",
			items: {
				type: "object",
				properties: {
					name: { type: "string" },
					value: { type: "string" },
				},
			},
		},
	},
	additionalProperties: false,
};

module.exports = {
	electroDeviceSchema,
	updatedElectorDeviceSchema,
};
