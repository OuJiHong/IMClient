
var path = require("path");
var webpack = require("webpack");
var HtmlWebpackPlugin = require("html-webpack-plugin");
var CleanWebpckPlugin = require("clean-webpack-plugin");

module.exports = {
    entry:"./src/main.js",
    output:{
        filename:"bundle-[hash].js",
        path:__dirname + "/dist",
        publicPath:""
    },
    devServer:{
        contentBase:"./dist",
        historyApiFallback:true,
        hot:true,
        inline:true,
        open:true
    },
    devtool:"eval-source-map",
    module:{
        rules:[
            {
                test:/\.css$/,
                use:["style-loader", "css-loader"]
            },{
                test:/\.(png|jpg|gif|bmp|svg)$/,
                use:[{
                    loader:"file-loader",
                    query:{
                        name:"asset/[name]-[hash].[ext]"
                    }
                }]
            },{
                test:/\.html$/,
                use:["html-loader"]
            }
        ]
    },
    resolve:{

    },
    plugins:[
        new CleanWebpckPlugin(["dist/*"],{
            root:__dirname,
            verbose:true,
            dry:true
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name:"vendor",
            filename:"vendor-[hash].js"
        }),
        new HtmlWebpackPlugin({
            template:"./src/index.html"
        })

    ]

};
