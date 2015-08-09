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

Call the module:

	// Given that CommonJS project is structured as follows:
	// (root)
	// 	-src
	// 		-main.js
	// 		-app.js
	// 	package.json

	var BrowserifyBridge = require('browserify-bridge');
	var path = require('path');

	var instance = new BrowserifyBridge({
		env: process.env,
		envWhiteList: ['MySpecialKeyOnly'],
		package: path.join(__dirname, "src", "package.json"),
		sources: [
			path.join(__dirname, 'src', 'main.js'),
			path.join(__dirname, 'src', 'app.js')
		]
	});

#Options

## sources (required)

List of absolute paths to sources files to include in the entry module.

> Notice: for non-node projects, the full path of the source file will be included in the entry module. 
> It is recommended to provide a `package.json` reference in variable `package` to assure source modules are included with relative paths

## env (optional)

Key/Value set of variables to assure are available on the `window.process.env` variable at runtime.

> Notice: Client frameworks should be careful is exported in code to prevent security issues. 
> See `envWhiteList` below to refine.

## envWhiteList (optional)

Key list of valid `env` keys to be applied to the `window.process.env` scope.

##  package (recommended/optional)

Location of project `package.json` to drive both `dependencies` exposure and relative source paths.
