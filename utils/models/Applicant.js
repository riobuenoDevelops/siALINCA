const applicantSchema = {
	$id: "applicant",
	type: "object",
	properties: {
		_id: { $ref: "modelId#" },
		cedula: { type: "string" },
		names: { type: "string" },
		lastNames: { type: "string" },
		disabled: { type: "boolean" },
		isDeleted: { type: "boolean" },
		createdAt: { type: "string" }
	},
	required: ["cedula", "names", "lastNames"],
	additionalProperties: false,
};

const updatedApplicantSchema = {
	$id: "updatedApplicant",
	type: "object",
	properties: {
		_id: { $ref: "modelId#" },
		cedula: { type: "string" },
		names: { type: "string" },
		lastNames: { type: "string" },
		disabled: { type: "boolean" },
		isDeleted: { type: "boolean" },
		createdAt: { type: "string" }
	},
	additionalProperties: false,
};

module.exports = {
	applicantSchema,
	updatedApplicantSchema,
};
