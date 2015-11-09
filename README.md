# dynamic-middleware [![Build Status](https://secure.travis-ci.org/kessler/node-dynamic-middleware.png?branch=master)](http://travis-ci.org/kessler/node-dynamic-middleware)

Replace or disable a connect/express middleware in runtime

compatible with express 3, express 4 and connect 3

### Why?

its quite inconvenient to replace a middleware after you start a connect / express server

### Major changes in 3.x.x

Previous versions operated by manipulating the internal state of express/connect , this approach worked well for real middlewares (.use()) but was terrible for routes (.get() etc..). The new version does not do that, but rather manages the state internally.

### install
```
    npm install dynamic-middleware
```

### usage

#### Single middleware
```javascript
var express = require('express')
var DynamicMiddleware = require('dynamic-middleware')

var app = express()

// a simple middleware
function myMiddleware(req, res, next) {
    res.end('1')
}

// create a dynamic one from it
var dm = DynamicMiddleware(myMiddleware)

app.get('/', dm.handler()) 

// disable the middleware, will reply with 404 now
dm.disable() 

// enable it back
dm.enable()

// or replace it with something else
dm = dm.replace(function(req, res, next) {
	res.end('2')
})
```
