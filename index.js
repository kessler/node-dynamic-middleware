var uuid = require('node-uuid')
var isArray = require('util').isArray

module.exports = function dynamicMiddlewareGenerator(app, middleware) {
	if (!app)
		throw new Error('missing app')

	if (!middleware)
		throw new Error('missing middleware')
	
	var id = uuid()

	function find() {
		
		var stack = getStack()

		for (var i = stack.length - 1; i >= 0; i--) {						
			
			if (id in stack[i].handle) {					
				return i
			}
		}	

		throw new Error('this middleware was already removed')
	}

	function getStack() {
		if (isArray(app.stack)) {
			return app.stack
		}

		if (app._router && isArray(app._router.stack)) {
			return app._router.stack
		}

		throw new Error('cannot find http stack, must be an incompatible version')
	}

	function dynamicMiddleware(req, res, next) {
		middleware(req, res, next)
	}

	dynamicMiddleware[id] = undefined

	dynamicMiddleware.use = function(route) {
		
		route = route || '/'

		app.use(route, this)
	}

	dynamicMiddleware.remove = function() {
		
		var i = find()

		getStack().splice(i, 1)
	}

	dynamicMiddleware.replace = function(_middleware) {
	
		var i = find()
		var stack = getStack()
		var newDm = stack[i].handle = dynamicMiddlewareGenerator(app, _middleware)

		return newDm
	}

	return dynamicMiddleware
}