const userSchema = {
	$id: "user",
	type: "object",
	properties: {
		_id: { $ref: "modelId#" },
		names: { type: "string" },
		lastNames: { type: "string" },
		email: { type: "string" },
		password: { type: "string" },
		roleId: { $ref: "role#/properties/_id" },
		config: {
			type: "object",
			properties: {
				nivelInventario: { type: "integer" },
			},
		},
	},
	required: ["names", "lastNames", "email", "password", "roleId"],
	additionalProperties: false,
};

const updatedUserSchema = {
	$id: "updateUser",
	type: "object",
	properties: {
		_id: { $ref: "modelId#" },
		names: { type: "string" },
		lastNames: { type: "string" },
		email: { type: "string" },
		password: { type: "string" },
		roleId: { $ref: "role#/properties/_id" },
		config: {
			type: "object",
			properties: {
				nivelInventario: { type: "integer" },
			},
		},
	},
	additionalProperties: false,
};

module.exports = {
	userSchema,
	updatedUserSchema,
};
