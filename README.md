# dynamic-middleware [![Build Status](https://secure.travis-ci.org/kessler/node-dynamic-middleware.png?branch=master)](http://travis-ci.org/kessler/node-dynamic-middleware)

Replace or disable a connect/express middleware in runtime

compatible with express 3, express 4 and connect 3

### Why?

its quite inconvenient to replace a middleware after you start a connect / express server

### Install
```
    npm install dynamic-middleware
```

### Usage
```javascript
const DynamicMiddleware = require('dynamic-middleware')
const express = require('express')

const app = express()

// a simple middleware
function myMiddleware(req, res, next) {
    res.end('1')
}

// create a dynamic one from it
let dm = DynamicMiddleware.create(myMiddleware)

app.get('/', dm.handler()) 

// disable the middleware, will reply with 404 now
dm.disable() 

// enable it back
dm.enable()

// or replace it with something else
dm = dm.replace(function(req, res, next) {
    res.end('2')
})

// create a dynamic error middlware
let errorDm = DynamicMiddleware.create((err, req, res, next) => { ... })

app.use(errorDm.errorHandler())

```

## see also
[loadbalance module](https://github.com/kessler/node-loadbalance)

[loadbalance-middleware module](https://github.com/kessler/node-loadbalance-middleware)

## changelog

### 3.x.x

Previous versions operated by manipulating the internal state of express/connect , this approach worked well for real middlewares (.use()) but was terrible for routes (.get() etc..). The new version does not do that, but rather manages the state internally.

### 4.x.x

The public interface of this module has changed

## license

[MIT](http://opensource.org/licenses/MIT) © [yaniv kessler](yanivkessler.com)