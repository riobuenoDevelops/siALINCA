const modelIdSchema = {
	$id: "modelId",
	type: "string",
	pattern: "[0-9a-fA-F]{24}",
};

module.exports = modelIdSchema;
