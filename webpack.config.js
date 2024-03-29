const PATH = require('path');

module.exports = {
    
    entry: './src/index.ts',
    output: {
        path: PATH.resolve(__dirname, './build'),
        filename: 'index.js',
    },
    mode: 'development',
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader'
            }
        ]
    },
    resolve: {
        extensions: ['.ts']
    },
    plugins:[
        new (require('browser-sync-webpack-plugin'))({
            port: 4200,
            https: true,
            server: { baseDir: ['.'] }
        })
    ]
};