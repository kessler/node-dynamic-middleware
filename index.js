var _ = require('lodash')
var debug = require('debug')('dynamic-middleware')

module.exports = DynamicMiddleware

function DynamicMiddleware(middleware) {
	if (!(this instanceof DynamicMiddleware)) return new DynamicMiddleware(middleware)
	this._init(middleware)
}

/**
 *	create a handler that can be used by express/connect
 *
 *	@returns {Function} a connect/express middleware
 */
DynamicMiddleware.prototype.handler = function() {
	var self = this

	return function handle(req, res, next) {
		if (self._disabled) {
			res.statusCode = 404
			return res.end()
		}

		res.statusCode = 200

		self._middleware(req, res, next)
	}
}

/**
 *	disable this middleware, once disable it will respond to requests with 404 status code
 *
 */
DynamicMiddleware.prototype.disable = function() {
	this._disabled = true
}

/**
 *	enable this middleware
 *
 */
DynamicMiddleware.prototype.enable = function() {
	this._disabled = false
}

/**
 *	replace the underlying middleware with something else
 *
 */
DynamicMiddleware.prototype.replace = function(middleware) {
	this._init(middleware)
}

DynamicMiddleware.prototype._init = function(middleware) {
	debug('initializing')

	// non empty constructor with a single middleware without weights
	if (typeof(middleware) !== 'function') {
		throw new Error('invalid middleware argument, must be a function or an array of functions or an array of loadbalance weighted entries')
	}

	this._middleware = middleware
}
