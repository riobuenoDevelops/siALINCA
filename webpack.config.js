var HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

module.exports = {
	mode: "development",
	module: {
		rules: [
			{
				test: /\.less$/,
				use: [
					{ loader: "style-loader" },
					{ loader: "css-loader" },
					{ loader: "less-loader" },
				],
			},
			{
				test: /\.(jpg|png|svg)$/,
				use: {
					loader: "file-loader",
					options: {
						limit: 25000,
					},
				},
			},
		],
	},
};
