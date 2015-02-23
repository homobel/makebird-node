
# Makebird

Makebird is a build tool for languages without modular system.

Makebird projects has representation in context tree. This tree may be distributed in file system. Contexts can be included or excluded in result text via base tokens that can be added by owner or by other developers.

## Usage

*installation*
	npm i -g makebird-node

*cmd*
	makebird --help

*from code*
	makebird.build(config, function(err, data, times) {
		if (err) {
			console.log(err);
			return;
		}

		// data usage

	});

See tests folder for more examples.

## Tokens

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

### Description

* name = variable: Word without spaces can contain letters only.
* namespace: Names separated by comma must contain at least 2 names.
* path: Path to the file relative to current file.

## Licence

The MIT License (MIT)

Copyright (c) 2014 Archy Sharp

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
