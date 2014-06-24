# connect-dynamic-middleware

### usage
```
var connect = require('connect')
var DynamicMiddleware = require('connect-dynamic-middleware')

var app = connect()

// 
function myMiddleware(req, res, next) {
	res.end('1')
}

var dm = DynamicMiddleware(app, myMiddleware)

dm.use('/')

// or

app.use('/', dm) 

// or even

app.use('/', myMiddleware)

// then

dm.remove() 

// or

dm = dm.replace(function(req, res, next) {
	res.end('2')
})


```