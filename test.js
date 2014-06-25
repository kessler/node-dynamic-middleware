var assert = require('assert')
var DynamicMiddleware = require('./index.js')
var connect = require('connect')
var request = require('request')

describe('DynamicMiddleware', function () {
	var dm, rm, app

	beforeEach(function () {
		rm = function(req, res, next) {
			res.end('1')
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
		var realApp = connect()

		var realDm = DynamicMiddleware(realApp, function(req, res) {
			res.end('1')
		})

		realApp.use('/gee', realDm)

		realApp.listen(3000, function() {
			request('http://localhost:3000/gee', function(err, res, body) {
				if (err) return done(err)
				assert.strictEqual(body, '1')				
				
				realDm.replace(function(req, res) {
					res.end('2')
				})

				request('http://localhost:3000/gee', function(err, res, body) {
					if (err) return done(err)
					assert.strictEqual(body, '2')
					done()
				})
			})
		})

	})
})

function App() {
	this.stack = []
}

App.prototype.use = function(route, fn) {
	this.stack.push({ route: route, handle: fn })
};