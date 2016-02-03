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
            exclude: /node_modules/
        },
        //  {
        //     test: /\.js$/,
        //     loader: "eslint-loader",
        //     exclude: /node_modules/
        // },
         {
            test: /\.css$/,
            loader: 'style-loader!css-loader'
        }, {
            test: /\.scss$/,
            loaders: ["style", "css", "sass"]
        }]
    },
    eslint: {
        // configFile: './.eslintrc'
    }
}
