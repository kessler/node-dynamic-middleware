var uuid = require('node-uuid')

module.exports = function dynamicMiddlewareGenerator(app, middleware) {
	var id = uuid()

	function find() {
		
		var stack = app.stack

		for (var i = stack.length - 1; i >= 0; i--) {						
			
			if (id in stack[i].handle) {					
				return i
			}
		}	

		throw new Error('this middleware was already removed')
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

		app.stack.splice(i, 1)
	}

	dynamicMiddleware.replace = function(_middleware) {
	
		var i = find()

		var newDm = app.stack[i].handle = dynamicMiddlewareGenerator(app, _middleware)

		return newDm
	}

	return dynamicMiddleware
}