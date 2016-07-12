var expect = require('chai').expect
var DynamicMiddleware = require('./index.js')
var connect3 = require('connect')
var express3 = require('express3')
var express4 = require('express')

var request = require('request')
var express = require('express')

describe('DynamicMiddleware', function () {
	var dm, handler, m1, m2, app, mockResponse, engine

	describe('wraps a normal middleware function and', function () {
		it('forward all requests to it', function () {
			handler(null, mockResponse, null)

			expect(mockResponse.invocations[0]).to.equal('1')
		})
		
		it('allow it to be disabled during runtime', function () {
			dm.disable()

			handler(null, mockResponse, null)

			expect(mockResponse.statusCode).to.equal(404)
		})

		it('allow it to be enabled during runtime', function () {
			dm.disable()

			handler(null, mockResponse, null)

			dm.enable()

			handler(null, mockResponse, null)

			expect(mockResponse.statusCode).to.equal(200)
		})

		it('allow it to be replaced during runtime', function () {
			dm.replace(function (req, res, next) {
				res.end('2')
			})

			handler(null, mockResponse, null)

			expect(mockResponse.invocations[0]).to.equal('2')
		})

		beforeEach(function () {
			dm = DynamicMiddleware.create(m1)

			handler = dm.handler()
		})
	})
	
	worksWith('connect 3', connect3(), function (app, handler) { app.use('/gee', handler) })
	worksWith('express 3', express3(), function (app, handler) { app.use('/gee', handler) })
	worksWith('express 3 get', express3(), function (app, handler) { app.get('/gee', handler) })
	worksWith('express 4', express4(), function (app, handler) { app.use('/gee', handler) })
	worksWith('express 4 get', express4(), function (app, handler) { app.get('/gee', handler) })
	
	function worksWith(label, implementation, bind) {
		it('works with ' + label, function(done) {

			var dynamicMiddleware = DynamicMiddleware.create(function(req, res) {
				res.end('1')
			})

			bind(implementation, dynamicMiddleware.handler())

			var server = implementation.listen(3000, function() {
				request('http://localhost:3000/gee', function(err, res, body) {				
					if (err) return done(err)
					expect(body).to.equal('1')
					
					dynamicMiddleware.replace(function(req, res) {
						res.end('2')
					})

					request('http://localhost:3000/gee', function(err, res, body) {
						if (err) return done(err)
						expect(body).to.equal('2')

						server.close(done)
					})
				})
			})
		})
	}

	beforeEach(function () {
		m1 = function(req, res, next) {
			res.end('1')
		}

		app = new App()

		mockResponse = new Response()
	})
})

function App() {
	this.stack = []
}

App.prototype.use = function(route, fn) {
	this.stack.push({ route: route, handle: fn })
};

function Response() {
	this.invocations = []
	this.statusCode = undefined
}

Response.prototype.end = function(v) {
	this.invocations.push(v)
}