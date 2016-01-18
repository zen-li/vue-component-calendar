module.exports = {
	entry: './src/main.js',
	output: {
		path: './build',
		publicPath: 'build/',
		filename: 'build.js',
		library: 'vueComCalendar'
	},
	module: {
		loaders: [{
			test: /\.vue$/,
			loader: 'vue'
		}, {
			test: /\.js$/,
			loader: 'babel',
			// make sure to exclude 3rd party code in node_modules
			exclude: /node_modules/
		}, {
			test: /\.css$/,
			loader: 'style-loader!css-loader'
		}, {
			test: /\.scss$/,
			loaders: ["style", "css", "sass"]
		}]
	}
}