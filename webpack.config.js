/**
 * Created by OJH on 2017/8/16.
 */

const path = require("path");

const CleanWebpackPlugin = require("clean-webpack-plugin");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const ExtractTextPlugin = require("extract-text-webpack-plugin");

const extractCss = new ExtractTextPlugin({filename:"[name]-[hash:7].css"});

var config =  {
    devtool : "eval-source-map",
    entry : {
        main:__dirname + "/src/main.js"
    },
    output : {
        path:__dirname + "/dist",
        publicPath:"",
        filename:"[name]-[hash].js",
        chunkFilename: "[name].chunk-[hash].js"
    },
    devServer:{
        contentBase: "./dist",
        historyApiFallback:true,
        inline:true,
        hot:true
    },
    module:{
        rules:[{
            test:/\.js$/,
            exclude:/node_modules/,
            use:{
                loader:"babel-loader",
                query:{
                    presets:["es2015"]
                }
            }
        },{
            test:/\.css$/,
            use:ExtractTextPlugin.extract({fallback:"style-loader", use:"css-loader?minimize=false"})
        },{
            test: /\.(ico|png|svg|jpg|gif)|(eot|woff|woff2|ttf)$/,
            use: ["file-loader?name=asset/[name]-[hash:7].[ext]"]
        },{
            test:/\.html$/,
            use: [{
                loader:"html-loader",
                query:{
                    attrs:["img:src", "link:href"]
                }
            }]
        },{
            test:/\.art$/,
            use:[{
                loader:"art-template-loader"
            }]
        }
        ]
    },
    resolve:{
        alias:{

        }

    },
    plugins:[
        new webpack.BannerPlugin("All rights reserved, piracy"),
        new CleanWebpackPlugin(["dist/*"], {root:__dirname, verbose:true, dry:false}),
        new webpack.optimize.CommonsChunkPlugin({
            name: "vendor",
            minChunks: function (module) {
                // 该配置假定你引入的 vendor 存在于 node_modules 目录中
                return module.context && module.context.indexOf('node_modules') !== -1;
            }
        }),
        new HtmlWebpackPlugin({
            template:"./src/index.html"
        }),
        extractCss
    ],
    externals:{

    }

};

//调试模式
process.env.DEBUG = true;

module.exports = config;

