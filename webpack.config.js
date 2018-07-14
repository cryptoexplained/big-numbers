var path = require("path");
var webpack = require('webpack');
var UglifyJsPlugin = require('uglifyjs-webpack-plugin');

var PROD = (process.env.NODE_ENV === "production");
var WEB = (process.env.USE_ENV === "web");

module.exports = {
    entry: "./index.js",
    target: WEB? "web" : "node",
    output: {
        filename: "bundle.js",
        path: WEB? path.resolve(__dirname, "dist/web") : path.resolve(__dirname, "dist/node"),
        library: "BigNumbers",
        libraryTarget: WEB? "var" : "umd",
        filename: PROD ? "big-numbers.min.js" : "big-numbers.js"
    },
    resolve: {
        extensions: [".js"]
    },
    optimization: {
        minimizer: [
            /*new UglifyJsPlugin({
                cache: true,
                parallel: true,
                uglifyOptions: {
                    compress: false,
                    ecma: 5,
                    mangle: true
                },
                sourceMap: true
            })*/
        ]
    }
    //plugins: PROD ? [
    //    new webpack.optimize.UglifyJsPlugin({
    //        compress: { warnings: false }
    //    })
    //] : []
};
