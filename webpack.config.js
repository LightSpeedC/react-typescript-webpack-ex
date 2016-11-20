'use strict';

const http = require('http');
const parseURL = require('url').parse;
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const USER = process.env.USERNAME.replace(/[^A-Za-z0-9]/g, '');
const PORT = +(process.env.PORT || parseInt(USER, 36) % 999 + 8000);

const PORT1 = PORT + 1;

module.exports = {
	entry: {
		reactjsx: './src/reactjsx.jsx',
		reacttsx: './src/reacttsx.tsx',
		mainjs: './src/mainjs.js',
		maintsx: './src/maintsx.tsx'
	},

	output: {
		path: 'dist',
		filename: 'js/[name].bundle.js',
		pathinfo: true
	},

	resolve: {
		extensions: ['', '.tsx', '.ts', '.jsx', '.js']
	},

	externals: {
		'react': 'React',
		'react-dom': 'ReactDOM',
		'react-bootstrap': 'ReactBootstrap',
		'light-request': 'request',
	},

	devtool: 'source-map',

	// webpack-dev-server
	devServer: {
		port: PORT, // ポート番号

		contentBase: 'dist', // コンテンツ配信用ルートディレクトリ

		hot: true, // HMR: ホット・モジュール・リプレースメント
		open: true, // 起動時にブラウザを開く
		inline: true, // inlineモード(true)、またはiframeモード(false) /webpack-dev-server

		setup: app => {
			app.set('json spaces', '  '); // JSON形式を指定→res.json({})
			app.use('/api0', (req, res, next) => res.json({api:'api0', headers:req.headers}));
		}, // setup

		// https://webpack.github.io/docs/webpack-dev-server.html#proxy
		// https://github.com/chimurai/http-proxy-middleware#readme
		// https://github.com/nodejitsu/node-http-proxy#options
		// 注: http://d.hatena.ne.jp/chi-bd/20160505/1462425497
		proxy: {
			'/api1/*': {
				target: 'http://localhost:' + PORT1, // 転送先
				pathRewrite: {'^/api1' : '/api01'}, // pathを変更
				changeOrigin: true, // headers.hostを変更 virtual-host等
				secure: false,
			}, // api1

			'/api2/*': {
				target: { // 転送先
					protocol: 'http:', // 重要
					host: 'localhost',
					port: PORT1,
				},
				pathRewrite: {'^/api2' : '/api02'}, // pathを変更
				changeOrigin: true, // headers.hostを変更 virtual-host等
				secure: false,
			}, // api2

			'/*': {
				bypass: (req, res) => {
					// api3
					if (req.url.startsWith('/api3'))
						res.end(['api3', req.method, req.url,
							JSON.stringify(req.headers, null, '  ')].join(' '));
					// api4
					else if (req.url.startsWith('/api4'))
						res.json({api: 'api4', method:req.method,
							url:req.url, headers:req.headers});
					// api5
					else if (req.url.startsWith('/api5')) {
						req.headers.host = 'virtual-host.your.domain:8000';
						const opts = parseURL('http://localhost:' +
							PORT1 + req.url.replace(/^\/api5/, '/api05'));
						opts.method = req.method;
						opts.headers = req.headers;
						req.pipe(http.request(opts, res2 => res2.pipe(res)));
					}
					else return req.url; // ←これが重要!
				}, // bypass
			}, // *
		}, // proxy
	}, // devServer

	module: {
		loaders: [
			{
				test: /\.jsx?$/,
				exclude: /node_modules/,
				loader: 'babel',
				query: {presets: ['react', 'es2015']},
			},
			{
				test: /\.tsx?$/,
				exclude: /node_modules/,
				loader: 'ts'
			},
		], // loaders
	}, // module

	plugins: [
		//new webpack.optimize.UglifyJsPlugin(), // -p
		//new webpack.optimize.DedupePlugin(),
		new webpack.HotModuleReplacementPlugin(), // --hot
		new webpack.DefinePlugin({
			DEBUG: process.env.DEBUG || 'true',
		}),
		new CopyWebpackPlugin([
			{from: '**/*.html', context: 'src'},
			{from: '**/*.css', context: 'src'},
			{from: '**/*.ico', context: 'src'},
			{from: '*', to: 'js', context: 'node_modules/react/dist'},
			{from: '*', to: 'js', context: 'node_modules/react-dom/dist'},
			{from: '*', to: 'js', context: 'node_modules/react-bootstrap/dist'},
			{from: '*', to: 'css', context: 'node_modules/bootstrap/dist/css'},
			{from: '*', to: 'fonts', context: 'node_modules/bootstrap/dist/fonts'},
			{from: '*.js', to: 'js', context: 'node_modules/light-request'},
		]), // CopyWebpackPlugin
	], // plugins
}; // module.exports

// start api server for webpack-dev-server
if ('webpack-dev-server' === require('path').basename(process.argv[1], '.js'))
	require('http').createServer((req, res) =>
		res.end([PORT1, req.method, req.url, req.headers.host || ''].join(' '))
	).listen(PORT1, () => console.log(' http://localhost:' + PORT1 + '/'));
