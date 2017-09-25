const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanPlugin = require('clean-webpack-plugin');
module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    // devServer: {
    //     contentBase: './dist'
    // },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
        }),
        // 构建之前先删除dist目录下面的文件夹
        new CleanPlugin(['dist'])
    ]
}