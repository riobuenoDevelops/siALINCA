const applicantSchema = {
	$id: "applicant",
	type: "object",
	properties: {
		_id: { $ref: "modelId#" },
		cedula: { type: "string" },
		names: { type: "string" },
		lastNames: { type: "string" },
		disabled: { type: "boolean" },
		deleted: { type: "boolean" },
		createAt: { type: "date" }
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
		deleted: { type: "boolean" },
		createAt: { type: "date" }
	},
	additionalProperties: false,
};

module.exports = {
	applicantSchema,
	updatedApplicantSchema,
};
