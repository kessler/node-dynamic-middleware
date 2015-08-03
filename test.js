var assert = require('assert')
var DynamicMiddleware = require('./index.js')
var connect3 = require('connect')
var express3 = require('express3')
var express4 = require('express')

var request = require('request')
var express = require('express')

describe('DynamicMiddleware', function () {
	var dm, rm, app

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

	worksWith('connect 3', connect3())
	worksWith('express 3', express3())
	worksWith('express 4', express4())

	function worksWith(label, implementation) {
		it('works with ' + label, function(done) {
			var realApp = implementation

			var realDm = DynamicMiddleware(realApp, function(req, res) {
				res.end('1')
			})

			realApp.use('/gee', realDm)

			var server = realApp.listen(3000, function() {
				request('http://localhost:3000/gee', function(err, res, body) {				
					if (err) return done(err)
					assert.strictEqual(body, '1')				
					
					realDm.replace(function(req, res) {
						res.end('2')
					})

					request('http://localhost:3000/gee', function(err, res, body) {
						if (err) return done(err)
						assert.strictEqual(body, '2')

						server.close(done)
					})
				})
			})
		})
	}

	beforeEach(function () {
		rm = function(req, res, next) {
			res.end('1')
		}

		app = new App()

		dm = DynamicMiddleware(app, rm)
	})
})

function App() {
	this.stack = []
}

App.prototype.use = function(route, fn) {
	this.stack.push({ route: route, handle: fn })
};