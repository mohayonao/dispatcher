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
  describe("#subscribe(address: string, subscription: function): void", function() {
    it("works", function() {
      var dispatcher = new Dispatcher();
      var spy1 = sinon.spy();
      var spy2 = sinon.spy();
      var spy3 = sinon.spy();
      var spy4 = sinon.spy();

      // subscribe
      dispatcher.subscribe("/foo", spy1);
      dispatcher.subscribe("/foo", spy2);
      dispatcher.subscribe("/bar", spy3);
      dispatcher.subscribe("baz/", spy4);
      // expect to be ignored
      dispatcher.subscribe("/foo", spy1);
      dispatcher.subscribe("/bar", "not function");

      assert(spy1.callCount === 0);
      assert(spy2.callCount === 0);
      assert(spy3.callCount === 0);
      assert(spy4.callCount === 0);

      // dispatch /foo
      dispatcher.dispatch("/foo", "data1");

      assert(spy1.callCount === 1);
      assert(spy1.args[0][0] === "data1");
      assert(spy2.callCount === 1);
      assert(spy2.args[0][0] === "data1");
      assert(spy3.callCount === 0);
      assert(spy4.callCount === 0);

      // dispatch /bar
      dispatcher.dispatch("/bar", "data2");

      assert(spy1.callCount === 1);
      assert(spy2.callCount === 1);
      assert(spy3.callCount === 1);
      assert(spy3.args[0][0] === "data2");
      assert(spy4.callCount === 0);

      // dispatch baz/
      dispatcher.dispatch("baz/", "data3");

      assert(spy1.callCount === 1);
      assert(spy2.callCount === 1);
      assert(spy3.callCount === 1);
      assert(spy4.callCount === 0);
    });
  });
  describe("#subscribe(subscription: { delegate: function }): void", function() {
    it("works", function() {
      var dispatcher = new Dispatcher();
      var spy1 = { delegate: sinon.spy() };
      var spy2 = { delegate: sinon.spy() };

      // subscribe
      dispatcher.subscribe(spy1);
      dispatcher.subscribe(spy2);
      // expect to be ignored
      dispatcher.subscribe(spy1);

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
  describe("#unsubscribe(address: string, subscription: function): void", function() {
    it("works", function() {
      var dispatcher = new Dispatcher();
      var spy1 = sinon.spy();
      var spy2 = sinon.spy();
      var spy3 = sinon.spy();
      var spy4 = sinon.spy();

      // subscribe
      dispatcher.subscribe("/foo", spy1);
      dispatcher.subscribe("/foo", spy2);
      dispatcher.subscribe("/bar", spy3);
      dispatcher.subscribe("baz/", spy4);

      // unsubscribe
      dispatcher.unsubscribe("/foo", spy2);
      dispatcher.unsubscribe("/bar", spy3);
      dispatcher.unsubscribe("/bar", "not function");
      dispatcher.unsubscribe("baz/", spy4);

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
  describe("#unsubscribe(subscription: { delegate: function }): void", function() {
    it("works", function() {
      var dispatcher = new Dispatcher();
      var spy1 = { delegate: sinon.spy() };
      var spy2 = { delegate: sinon.spy() };

      // subscribe
      dispatcher.subscribe(spy1);
      dispatcher.subscribe(spy2);

      // unsubscribe
      dispatcher.unsubscribe(spy2);

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

      // subscribe
      dispatcher.subscribe(spy1);
      dispatcher.subscribe(spy2);

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
  describe("#delegate(address: string, data: any): void", function() {
    it("works", function() {
      var dispatcher = new Dispatcher();
      var spy1 = sinon.spy();
      var spy2 = sinon.spy();
      var spy3 = sinon.spy();

      dispatcher["/foo"] = spy1;
      dispatcher["/bar"] = spy2;
      dispatcher["baz/"] = spy3;

      assert(spy1.callCount === 0);
      assert(spy2.callCount === 0);
      assert(spy3.callCount === 0);

      // dispatch /foo
      dispatcher.delegate("/foo", "data1");

      assert(spy1.callCount === 1);
      assert(spy1.args[0][0] === "data1");
      assert(spy2.callCount === 0);
      assert(spy3.callCount === 0);

      // dispatch /bar
      dispatcher.delegate("/bar", "data2");

      assert(spy1.callCount === 1);
      assert(spy2.callCount === 1);
      assert(spy2.args[0][0] === "data2");
      assert(spy3.callCount === 0);

      // dispatch /baz
      dispatcher.delegate("/baz", "data3");

      assert(spy1.callCount === 1);
      assert(spy2.callCount === 1);
      assert(spy3.callCount === 0);

      // dispatch baz/
      dispatcher.delegate("baz/", "data4");

      assert(spy1.callCount === 1);
      assert(spy2.callCount === 1);
      assert(spy3.callCount === 0);
    });
  });
});
