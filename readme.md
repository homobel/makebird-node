
# Description

Makebird is zero abstraction cost module system.

Do I need it?
* Would you like to have project spread in multiple files and then build them into one?
* Does your language have good enough built in modules support?
* Would you like paste content of a file to specific place into another one?
* Do you need toggle peaces of code based on some flags or based on code usage?
* Do you have dependent projects with similar structure of dependencies?
* Do you care about code beauty after build stage?

Makebird project has representation in context tree. This tree can be distributed in file system. Context can be included or excluded in result text (see define, if, component, base tokens description).

## Usage

### Bash

Installation
```bash
npm i -g makebird

makebird -h

  Usage: makebird [options] <file ...>

  Options:

    -h, --help                       output usage information
    -V, --version                    output the version number
    -t --charset <charset>           input files charset
    -o --no-onlyUsed                 include only used contexts
    -p --partExtensions [list]       allowed extensions
    -c --copyrightExtensions [list]  copyright extensions
```

Defaults appropriately: utf8 [.js] [.txt]

Write result in output file
```bash
makebird path/to/input/file > output/file
```

### Code

```bash
npm i makebird
```

```js
var makebird = require('makebird');

makebird.build(config, function(err, result, times) {
	if (err) {
		console.log(err);
		return;
	}

	// result usage

});
```

## Tokens

```js
//!~ makebird comment will be cut out of the result

// set context name
//~ name [name]

// set context description (may be used in UI tools in future)
//~ info [info]

// stack copyright file
//~ copyright [path]
// all copyrights will be on the top of result text

// paste content of the file instead token (without creating of new context)
//~ part [path]

// paste content of the file instead token (with creating of new context)
//~ component [path]

// files inclueded as components must contain name token
// otherwise it will be randomly generated so you can't reffer to the context in base token

//~ define [variable]
// currently supported just boolean value (defined or not)

// set dependency of context
//~ base [namespace]
//~ base [namespace].*
//~ base ~.[namespace]
//~ base ~.[namespace].*

// ~ is placeholder for all parent contexts
// * is placeholder for context children
// absolute namespaces (without ~) not so usefull since namespace itself may easily change

// open new context
//~ if [variable]
//~ if this.[name]
//~ if this.*
//~ if [namespace]
//~ if [namespace].*

// this is placeholder for current context
// * means any module within current context

// close context
//~ endif

// //~ component a.txt (a.txt has "a" name) is equal to //~ if this.a ... //~ endif

//~ mind [path]
// take into account bases from other project but don't include them in current one

// name & variable: Word without spaces can contain letters only
// namespace: Names separated by dot. Must contain at least 2 names (special names included).
// path: Path to the file relative to current file
```

### Recommendations & Notes

* use CamelCase with first capital letter for name token
* use camelCase with first stroke letter for if token
* define token is aimed for debug mode and some others mostly
* inside libraries use ~.namespace notation for internal bases
* use longest possible namespaces to avoid conflicts 

## Example

_This example presents in examples directory._

Let's say we have a warnings library (js & css files) and we use it in our application.

_app/index.html_
```html
<!doctype html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Makebird app example</title>
        <link rel="stylesheet" href="dist/style.css">
    </head>
    <body>
        <script src="dist/script.js"></script>
    </body>
</html>
```

_app/copyright.txt_
```
/*
* Test app example
* (C) Archy Sharp 2016
*/
```

_app/js/warnings.js_
```js
//~ name Warnings

var warnings = new function() {

	function createWarning(text, type) {
		var node = document.createElement('div');
		node.classList.add('warning');
		node.classList.add(type);
		node.textContent = text;
		return node;
	}

	//~ if this.error
	this.error = function(node, text) {
		node.appendChild(createWarning(text, 'error'));
	};
	//~ endif

	//~ if this.notification
	this.notification = function(node, text) {
		node.appendChild(createWarning(text, 'notification'));
	};
	//~ endif

	//~ if this.info
	this.info = function(node, text) {
		node.appendChild(createWarning(text, 'info'));
	};
	//~ endif

};
```

_app/js/app.js_
```js
//~ copyright ../copyright.txt

//~ define withError
//~ base ~.Warnings.notification

//~ if withError
	//~ base ~.Warnings.error
//~ endif

(function() {

	//~ component warnings.js

	var body = document.body;

	warnings.notification(body, 'Notification message');
	//~ if withError
	warnings.error(body, 'Error message');
	//~ endif

	//~ part other.js


})();
```

_app/js/other.js_
```js
// just example of part token
```

_app/css/warnings.css_
```css
//~ name Warnings

.warning {
    padding: 30px;
    font-size: 15px;
    border-radius: 5px;
    box-shadow: 0 0 5px rgba(0,0,0,.1);
    margin-bottom: 10px;
}

//~ if this.error
.warning.error {
    background: tomato;
    color: white;
}
//~ endif

//~ if this.notification
.warning.notification {
    background: gainsboro;
    color: darkslategrey;
}
//~ endif

//~ if this.info
.warning.info {
    background: deepskyblue;
    color: black;
}
//~ endif
```

_app/css/app.css_
```css
//~ copyright ../copyright.txt

body {
    padding: 30px;
    margin: 0;
    font: normal 13px/16px Arial, sans-serif;
}

//~ mind ../js/app.js
//~ component warnings.css
```

**RESULTS**

```bash
../examples: makebird app/js/app.js > app/dist/script.js
```

```bash
../examples: makebird app/css/app.css -p .css > app/dist/style.css
```

_app/dist/script.js_
```js
/*
* test app example
* (C) Archy Sharp 2016
*/




(function() {

	var warnings = new function() {

		function createWarning(text, type) {
			var node = document.createElement('div');
			node.classList.add('warning');
			node.classList.add(type);
			node.textContent = text;
			return node;
		}

		this.error = function(node, text) {
			node.appendChild(createWarning(text, 'error'));
		};

		this.notification = function(node, text) {
			node.appendChild(createWarning(text, 'notification'));
		};

	};

	var body = document.body;

	warnings.notification(body, 'Notification message');

	warnings.error(body, 'Error message');

	// just example of part token

})();
```

_app/dist/style.css_
```js
/*
* test app example
* (C) Archy Sharp 2016
*/



body {
    padding: 30px;
    margin: 0;
    font: normal 13px/16px Arial, sans-serif;
}

.warning {
    padding: 30px;
    font-size: 15px;
    border-radius: 5px;
    box-shadow: 0 0 5px rgba(0,0,0,.1);
    margin-bottom: 10px;
}

.warning.error {
    background: tomato;
    color: white;
}

.warning.notification {
    background: gainsboro;
    color: darkslategrey;
}
```
