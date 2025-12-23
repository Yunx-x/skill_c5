const path = require("node:path");

const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
	entry: "/src/main.ts",
	output: {
		filename: "main.js",
		path: path.resolve(__dirname, "dist"),
	},
	target: "node",
	mode: "production",
	optimization: {
		minimize: false,
		minimizer: [
			new TerserPlugin({
				terserOptions: {
					format: {
						comments: false, //删除注释
					},
				},
				extractComments: false, //是否将注释剥离到单独的文件中
			}),
		],
	},
	resolve: {
		extensions: [".ts", ".js"],
	},
	module: {
		rules: [
			{
				test: /\.(tsx|ts)$/,
				use: "ts-loader",
				exclude: /node_modules/,
			},
		],
	},
	plugins: [],
};
