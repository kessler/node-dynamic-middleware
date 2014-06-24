var assert = require('assert')
var DynamicMiddleware = require('./index.js')
var connect = require('connect')
describe('DynamicMiddleware', function () {
	var dm, rm, app

	beforeEach(function () {
		rm = function(req, res, next) {
			res.end()
		}

		app = new App()

		dm = DynamicMiddleware(app, rm)
	})

	it('can be used', function () {
		dm.use('/blah')
		assert.strictEqual(app.stack[0].route, '/blah')
	})

	it('can be removed', function () {
		dm.use('/blah')
		assert.strictEqual(app.stack[0].route, '/blah')
		dm.remove()
		assert.strictEqual(app.stack.length, 0)
	})

	it('can be replaced', function () {
		dm.use('/blah')
		assert.strictEqual(app.stack[0].route, '/blah')
		var replace = function(rq,rs,next) {}
		
		var newDm = dm.replace(replace)
		
		assert.strictEqual(app.stack.length, 1)
		assert.strictEqual(app.stack[0].handle, newDm)
	})

	it('works with a real connect app', function(done) {
		var app = connect()

		var dm = DynamicMiddleware(app, rm)

	})
})

function App() {
	this.stack = []
}

App.prototype.use = function(route, fn) {
	this.stack.push({ route: route, handle: fn })
};