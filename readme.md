
# Makebird

Makebird is a build tool for languages without modular system.

Makebird projects has representation in context tree. This tree may be distributed in file system. Contexts can be included or excluded in result text via base tokens that can be added by owner or by other developers (this behaviour is optional).

## Usage

### Bash

```bash
npm i -g makebird
```

```bash

  Usage: makebird [options]

  Options:

    -h, --help                         output usage information
    -V, --version                      output the version number
    -f, --file [src]                   input file
    -ch, --charset                     input charset
    -ou, --onlyUsed                    include only used
    -pe, --partExtensions [list]       part extensions
    -ce, --copyrightExtensions [list]  copyright extensions

```

### Code

```bash
npm i makebird
```

```js
makebird.build(config, function(err, result, times) {
	if (err) {
		console.log(err);
		return;
	}

	// result usage

});
```

See tests folder for more examples.

## Tokens

```js
//~ name [name]
// set context name

//~ info [info]
// set context description

//~ part [path]
// just external file in project

//~ component [path]
// external file that is a context also

//~ define [variable]
// define variable

//~ base [namespace]
//~ base [namespace].*
//~ base ~.[namespace]
//~ base ~.[namespace].*
// set dependency of context
// ~ means all parent contexts behind (namespace is unpredictable)
// * means all context below

//~ if [variable]
//~ if this.[name]
//~ if this.*
//~ if [namespace]
//~ if [namespace].*
// open new context
// this means namespace from parent context to root
// * means any module within current context

//~ endif
// close context

//~ mind [path]
// means take into account bases from other project but don't include them in current one
```

### Description

* name = variable: Word without spaces can contain letters only.
* namespace: Names separated by comma must contain at least 2 names.
* path: Path to the file relative to current file.

### Recommendations & Notes

* use CamelCase with first capital letter in name token
* use camelCase with first stroke letter in if token
* define primary for debug, eis and some other flags.
* in libraries use ~.namespace notation for internal bases (so it can be put in other contexts)
* use longest possible namespases

## Licence

The MIT License (MIT)
