# browserify-bridge
Browserify API Generator for Javascript SDK Projects

![Thank the knife](http://i.imgur.com/BZ5R5NP.png)

=============================

This module is designed to help build Javascript API's with Browserify that can be used cross platform.

What it does:

- creates Browserify compatible Entry module
- exposes all NPM dependencies on module scope
- exposes direct apis to specific source modules
- makes NODE_ENV args accessible on global scope (build variables)

Why that is important (from the SDK API perspective):

- access NPM dependencies directly (Jquery, Underscore, etc)
- access CommonJS instances directly (Subclass, Module instance interaction, etc)
- access build variables to control runtime behavior

#Usage

	`npm install browserify-bridge --save`

In the module:

	// Given that CommonJS project is structured as follows:
	// (root)
	// 	-src
	// 		-main.js
	// 		-app.js
	// 	package.json

	var MetroNode = require('metronode');
	var path = require('path');

	var instance = new MetroNode({
		sourceRoot: path.join(__dirname, 'src'),
		env: process.env,
		packageRoot: __dirname,
		sourceFiles: [
			path.join(__dirname, 'src', 'main.js'),
			path.join(__dirname, 'src', 'app.js')
		]
	});

#Warning: ENV dictionary will be exported as-is.
This can cause security issues if you are storing secrets in `env` values.
To avoid, use the `envWhiteList` constructor argument to limit.

	// Given that CommonJS project is structured as follows:
	// (root)
	// 	-src
	// 		-main.js
	// 		-app.js
	// 	package.json

	var MetroNode = require('metronode');
	var path = require('path');

	var instance = new MetroNode({
		sourceRoot: path.join(__dirname, 'src'),
		env: process.env,
		packageRoot: __dirname,
		sourceFiles: [
			path.join(__dirname, 'src', 'main.js'),
			path.join(__dirname, 'src', 'app.js')
		],
		envWhiteList: ['MySpecialKeyOnly']
	});
