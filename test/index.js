"use strict";

var assert = require("power-assert");
var sinon = require("sinon");
var EventEmitter = require("@mohayonao/event-emitter");
var Dispatcher = require("../");

describe("Dispatcher", function() {
  describe("constructor()", function() {
    it("works", function() {
      var dispatcher = new Dispatcher();

      assert(dispatcher instanceof Dispatcher);
      assert(dispatcher instanceof EventEmitter);
    });
  });
  describe("#register(address: string, subscription: function): void", function() {
    it("works", function() {
      var dispatcher = new Dispatcher();
      var spy1 = sinon.spy();
      var spy2 = sinon.spy();
      var spy3 = sinon.spy();
      var spy4 = sinon.spy();

      // register
      dispatcher.register("/foo", spy1);
      dispatcher.register("/foo", spy2);
      dispatcher.register("/bar", spy3);
      dispatcher.register("baz/", spy4);
      // expect to be ignored
      dispatcher.register("/foo", spy1);
      dispatcher.register("/bar", "not function");

      assert(spy1.callCount === 0);
      assert(spy2.callCount === 0);
      assert(spy3.callCount === 0);
      assert(spy4.callCount === 0);

      // dispatch /foo
      dispatcher.dispatch("/foo", "data1");

      assert(spy1.callCount === 1);
      assert(spy1.args[0][0] === "data1");
      assert(spy1.args[0][1] === "/foo");
      assert(spy2.callCount === 1);
      assert(spy2.args[0][0] === "data1");
      assert(spy2.args[0][1] === "/foo");
      assert(spy3.callCount === 0);
      assert(spy4.callCount === 0);

      // dispatch /bar
      dispatcher.dispatch("/bar", "data2");

      assert(spy1.callCount === 1);
      assert(spy2.callCount === 1);
      assert(spy3.callCount === 1);
      assert(spy3.args[0][0] === "data2");
      assert(spy3.args[0][1] === "/bar");
      assert(spy4.callCount === 0);

      // dispatch baz/
      dispatcher.dispatch("baz/", "data3");

      assert(spy1.callCount === 1);
      assert(spy2.callCount === 1);
      assert(spy3.callCount === 1);
      assert(spy4.callCount === 0);
    });
  });
  describe("#register(subscription: function): void", function() {
    it("works", function() {
      var dispatcher = new Dispatcher();
      var spy1 = sinon.spy();
      var spy2 = sinon.spy();

      // register
      dispatcher.register(spy1);
      dispatcher.register(spy2);
      // expect to be ignored
      dispatcher.register(spy1);

      assert(spy1.callCount === 0);
      assert(spy2.callCount === 0);

      // dispatch /foo
      dispatcher.dispatch("/foo", "data1");

      assert(spy1.callCount === 1);
      assert(spy1.args[0][0] === "data1");
      assert(spy1.args[0][1] === "/foo");
      assert(spy2.callCount === 1);
      assert(spy2.args[0][0] === "data1");
      assert(spy2.args[0][1] === "/foo");

      // dispatch /bar
      dispatcher.dispatch("/bar", "data2");

      assert(spy1.callCount === 2);
      assert(spy1.args[1][0] === "data2");
      assert(spy1.args[1][1] === "/bar");
      assert(spy2.callCount === 2);
      assert(spy2.args[1][0] === "data2");
      assert(spy2.args[1][1] === "/bar");

      // dispatch baz/
      dispatcher.dispatch("baz/", "data3");

      assert(spy1.callCount === 2);
      assert(spy2.callCount === 2);
    });
  });
  describe("#register(subscription: { delegate: function }): void", function() {
    it("works", function() {
      var dispatcher = new Dispatcher();
      var spy1 = { delegate: sinon.spy() };
      var spy2 = { delegate: sinon.spy() };

      // register
      dispatcher.register(spy1);
      dispatcher.register(spy2);
      // expect to be ignored
      dispatcher.register(spy1);

      assert(spy1.delegate.callCount === 0);
      assert(spy2.delegate.callCount === 0);

      // dispatch /foo
      dispatcher.dispatch("/foo", "data1");

      assert(spy1.delegate.callCount === 1);
      assert(spy1.delegate.args[0][0] === "/foo");
      assert(spy1.delegate.args[0][1] === "data1");
      assert(spy2.delegate.callCount === 1);
      assert(spy2.delegate.args[0][0] === "/foo");
      assert(spy2.delegate.args[0][1] === "data1");

      // dispatch /bar
      dispatcher.dispatch("/bar", "data2");

      assert(spy1.delegate.callCount === 2);
      assert(spy1.delegate.args[1][0] === "/bar");
      assert(spy1.delegate.args[1][1] === "data2");
      assert(spy2.delegate.callCount === 2);
      assert(spy2.delegate.args[1][0] === "/bar");
      assert(spy2.delegate.args[1][1] === "data2");

      // dispatch baz/
      dispatcher.dispatch("baz/", "data3");

      assert(spy1.delegate.callCount === 2);
      assert(spy2.delegate.callCount === 2);
    });
  });
  describe("#unregister(address: string, subscription: function): void", function() {
    it("works", function() {
      var dispatcher = new Dispatcher();
      var spy1 = sinon.spy();
      var spy2 = sinon.spy();
      var spy3 = sinon.spy();
      var spy4 = sinon.spy();

      // register
      dispatcher.register("/foo", spy1);
      dispatcher.register("/foo", spy2);
      dispatcher.register("/bar", spy3);
      dispatcher.register("baz/", spy4);

      // unregister
      dispatcher.unregister("/foo", spy2);
      dispatcher.unregister("/bar", spy3);
      dispatcher.unregister("/bar", "not function");
      dispatcher.unregister("baz/", spy4);

      assert(spy1.callCount === 0);
      assert(spy2.callCount === 0);
      assert(spy3.callCount === 0);
      assert(spy4.callCount === 0);

      // dispatch /foo
      dispatcher.dispatch("/foo", "data1");

      assert(spy1.callCount === 1);
      assert(spy1.args[0][0] === "data1");
      assert(spy2.callCount === 0);
      assert(spy3.callCount === 0);
      assert(spy4.callCount === 0);

      // dispatch /bar
      dispatcher.dispatch("/bar", "data2");

      assert(spy1.callCount === 1);
      assert(spy2.callCount === 0);
      assert(spy3.callCount === 0);
      assert(spy4.callCount === 0);

      // dispatch baz/
      dispatcher.dispatch("baz/", "data3");

      assert(spy1.callCount === 1);
      assert(spy2.callCount === 0);
      assert(spy3.callCount === 0);
      assert(spy4.callCount === 0);
    });
  });
  describe("#unregister(subscription: function): void", function() {
    it("works", function() {
      var dispatcher = new Dispatcher();
      var spy1 = sinon.spy();
      var spy2 = sinon.spy();

      // register
      dispatcher.register(spy1);
      dispatcher.register(spy2);

      // unregister
      dispatcher.unregister(spy2);

      assert(spy1.callCount === 0);
      assert(spy2.callCount === 0);

      // dispatch /foo
      dispatcher.dispatch("/foo", "data1");

      assert(spy1.callCount === 1);
      assert(spy1.args[0][0] === "data1");
      assert(spy1.args[0][1] === "/foo");
      assert(spy2.callCount === 0);

      // dispatch /bar
      dispatcher.dispatch("/bar", "data2");

      assert(spy1.callCount === 2);
      assert(spy1.args[1][0] === "data2");
      assert(spy1.args[1][1] === "/bar");
      assert(spy2.callCount === 0);

      // dispatch baz/
      dispatcher.dispatch("baz/", "data3");

      assert(spy1.callCount === 2);
      assert(spy2.callCount === 0);
    });
  });
  describe("#unregister(subscription: { delegate: function }): void", function() {
    it("works", function() {
      var dispatcher = new Dispatcher();
      var spy1 = { delegate: sinon.spy() };
      var spy2 = { delegate: sinon.spy() };

      // register
      dispatcher.register(spy1);
      dispatcher.register(spy2);

      // unregister
      dispatcher.unregister(spy2);

      assert(spy1.delegate.callCount === 0);
      assert(spy2.delegate.callCount === 0);

      // dispatch /foo
      dispatcher.dispatch("/foo", "data1");

      assert(spy1.delegate.callCount === 1);
      assert(spy1.delegate.args[0][0] === "/foo");
      assert(spy1.delegate.args[0][1] === "data1");
      assert(spy2.delegate.callCount === 0);

      // dispatch /bar
      dispatcher.dispatch("/bar", "data2");

      assert(spy1.delegate.callCount === 2);
      assert(spy1.delegate.args[1][0] === "/bar");
      assert(spy1.delegate.args[1][1] === "data2");
      assert(spy2.delegate.callCount === 0);

      // dispatch baz/
      dispatcher.dispatch("baz/", "data3");

      assert(spy1.delegate.callCount === 2);
      assert(spy2.delegate.callCount === 0);
    });
  });
  describe("#dispatch(address: string, data: any): void", function() {
    it("works", function() {
      var dispatcher = new Dispatcher();
      var spy1 = { delegate: sinon.spy() };
      var spy2 = { delegate: sinon.spy() };

      // register
      dispatcher.register(spy1);
      dispatcher.register(spy2);

      assert(spy1.delegate.callCount === 0);
      assert(spy2.delegate.callCount === 0);

      // dispatch /foo
      dispatcher.dispatch("/foo", "data1");

      assert(spy1.delegate.callCount === 1);
      assert(spy1.delegate.args[0][0] === "/foo");
      assert(spy1.delegate.args[0][1] === "data1");
      assert(spy2.delegate.callCount === 1);
      assert(spy2.delegate.args[0][0] === "/foo");
      assert(spy2.delegate.args[0][1] === "data1");

      // dispatch /bar
      dispatcher.dispatch("/bar", "data2");

      assert(spy1.delegate.callCount === 2);
      assert(spy1.delegate.args[1][0] === "/bar");
      assert(spy1.delegate.args[1][1] === "data2");
      assert(spy2.delegate.callCount === 2);
      assert(spy2.delegate.args[1][0] === "/bar");
      assert(spy2.delegate.args[1][1] === "data2");

      // dispatch baz/
      dispatcher.dispatch("baz/", "data3");

      assert(spy1.delegate.callCount === 2);
      assert(spy2.delegate.callCount === 2);
    });
  });
});
describe("Delegator", function() {
  describe("constructor()", function() {
    it("works", function() {
      var delegator = new Dispatcher.Delegator();

      assert(delegator instanceof Dispatcher.Delegator);
    });
  });
  describe("#delegate(address: string, data: any): void", function() {
    it("works", function() {
      var dispatcher = new Dispatcher();
      var delegator = new Dispatcher.Delegator();
      var spy1 = sinon.spy();
      var spy2 = sinon.spy();
      var spy3 = sinon.spy();

      dispatcher.register(delegator);

      delegator["/foo"] = spy1;
      delegator["/bar"] = spy2;
      delegator["baz/"] = spy3;

      assert(spy1.callCount === 0);
      assert(spy2.callCount === 0);
      assert(spy3.callCount === 0);

      // dispatch /foo
      dispatcher.dispatch("/foo", "data1");

      assert(spy1.callCount === 1);
      assert(spy1.args[0][0] === "data1");
      assert(spy2.callCount === 0);
      assert(spy3.callCount === 0);

      // dispatch /bar
      dispatcher.dispatch("/bar", "data2");

      assert(spy1.callCount === 1);
      assert(spy2.callCount === 1);
      assert(spy2.args[0][0] === "data2");
      assert(spy3.callCount === 0);

      // dispatch /baz
      dispatcher.dispatch("/baz", "data3");

      assert(spy1.callCount === 1);
      assert(spy2.callCount === 1);
      assert(spy3.callCount === 0);

      // dispatch baz/
      dispatcher.dispatch("baz/", "data4");

      assert(spy1.callCount === 1);
      assert(spy2.callCount === 1);
      assert(spy3.callCount === 0);
    });
  });
});
