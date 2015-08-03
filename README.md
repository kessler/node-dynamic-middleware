# dynamic-middleware [![Build Status](https://secure.travis-ci.org/kessler/node-dynamic-middleware.png?branch=master)](http://travis-ci.org/kessler/node-dynamic-middleware)

turn a connect middleware into a runtime replaceable, deletable middleware

compatible with express 3, express 4 and connect 3

### Why?

its quite inconvenient to replace a middleware after you start a connect / express server

### install
```
	npm install dynamic-middleware
```

### usage
```
var connect = require('connect')
var DynamicMiddleware = require('dynamic-middleware')

var app = connect()

// a simple middleware
function myMiddleware(req, res, next) {
	res.end('1')
}

// create a dynamic one from it
var dm = DynamicMiddleware(app, myMiddleware)

dm.use('/')

// same as:

app.use('/', dm) 

// remove the middleware
dm.remove() 

// or replace it with something else
dm = dm.replace(function(req, res, next) {
	res.end('2')
})

```
