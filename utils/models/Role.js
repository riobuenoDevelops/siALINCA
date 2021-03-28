const roleSchema = {
	$id: "role",
	type: "object",
	properties: {
		_id: { $ref: "modelId#" },
		name: { type: "string" },
		permissions: { type: "array" },
	},
	required: ["name", "permissions"],
	additionalProperties: false,
};

const updatedRoleSchema = {
	$id: "updateRole",
	type: "object",
	properties: {
		_id: { $ref: "modelId#" },
		name: { type: "string" },
		permissions: { type: "array" },
	},
	additionalProperties: false,
};

module.exports = {
	roleSchema,
	updatedRoleSchema,
};
