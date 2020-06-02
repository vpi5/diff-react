const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');

const createElement = (type, props, ...children) => {
    if (props === null) props = {};
    return { type, props, children };
};

module.exports = {
    mode: 'development',
    entry: {
        main: './src/index.js',
    },
    module: {
        rules: [
            {
                test: /\.(js|mjs|jsx|ts|tsx)$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/env', '@babel/react']
                    }
                },
                exclude: /(node_modules|bower_components)/, // 千万别忘记添加exclude选项,不然运行可能会报错
            }
        ],
    },
    externals:{},
    plugins: [
        new CopyWebpackPlugin({
            patterns : [{
                from: path.resolve(__dirname, 'public'),
                to  : path.resolve(__dirname, 'dist')
            }],
            options : {}
        }),
        new webpack.DefinePlugin({
            'createElement' : createElement
        })
    ],
    // 出口
    output: {
        filename: 'com.react.js',
        path: path.resolve(__dirname, 'dist'),
        library : 'rt',
        libraryTarget: "umd"
    },
};
