# browserify-bridge
Browserify entry module generator for CommonJS Libraries

![Thank the knife](http://i.imgur.com/BZ5R5NP.png)

***

This module is designed to help build Javascript API's with Browserify that can be used cross-platform.

What it does:

- creates Browserify compatible Entry module
- exposes all NPM dependencies on module scope
- exposes direct apis to specific source modules

Why that is important (from the SDK API perspective):

- don't have to keep track of which modules are exposed in your entry point
- access NPM dependencies directly (Jquery, Underscore, etc)
- access CommonJS instances directly (Subclass, Module instance interaction, etc)

# 2-second Example

Given the following project setup:

```javascript
src
|-- config.js
|-- ioc.js
|-- main.js
|-- model
|------ base.js
|-- provider
|------ base.js
|------ network.js
package.json
```

The `browserify-bridge` plugin generates `browserify` entry module:

```javascript
function a(e,t,n){var r=e,i=t.split("."),s;while(i.length>0){s=i.shift();if(!r[s]){if(i.length>0)r[s]={};else{r[s]=n}}r=r[s]}};

exports["async"]=require("async");
exports["glob"]=require("glob");
exports["momentr"]=require("momentr");
exports["request"]=require("request");
exports["underscore"]=require("underscore");

a(exports,'config', require('/home/toddpi314/project/src/config.js'))
a(exports,'ioc', require('/home/toddpi314/project/src/ioc.js'))
a(exports,'main', require('/home/toddpi314/project/src/main.js'))
a(exports,'model.base', require('/home/toddpi314/project/src/model/base.js'))
a(exports,'provider.base', require('/home/toddpi314/project/src/provider/base.js'))
a(exports,'provider.network', require('/home/toddpi314/project/src/provider/network.js'))
```

Running `browserify` on the `browserify-bridge` generated entry module (with a standalone namespace) gives you easy access:

```javascript
// Assuming "SDK" is the browserify standalone namespace

// API methods
SDK.config.myMethod(...);
SDK.async.each(...);

// NPM injected libraries
SDK.underscore.throttle(...);
```

ok, ok, that was like 20 seconds...

# Usage

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
		package: path.join(__dirname, "src", "package.json"),
		sources: [
			path.join(__dirname, 'src', 'main.js'),
			path.join(__dirname, 'src', 'app.js')
		],
		relativeApiRoot: path.join(_dirname, "src")
	});

# Options

## sources (required)

List of absolute paths to sources files to include in the entry module.

>	Notice for non-node projects, the full path of the source file will be included in the entry module. It is recommended to use either option `opts.basedir` or `full-path` with `browserify`


##  package (recommended/optional)

Location of project `package.json` to drive NPM `dependencies` injection.

`devDependencies` is ignored.

## relativeApiRoot (optional)

Control the folder prefix that is parsed into the public api. For instance, if sources are in a `src` directory, provide an absolute path beneath that directory to avoid apis with `SDK.src.component`
