import assert from "power-assert";
import sinon from "sinon";
import EventEmitter from "@mohayonao/event-emitter";
import Dispatcher from "../src/Dispatcher";
import Delegator from "../src/Delegator";

describe("Delegator", () => {
  describe("constructor()", () => {
    it("works", () => {
      let delegator = new Delegator();

      assert(delegator instanceof Delegator);
      assert(delegator instanceof EventEmitter);
    });
  });
  describe("#delegate(address: string, data: any): void", () => {
    it("works", () => {
      let dispatcher = new Dispatcher();
      let delegator = new Delegator();
      let spy1 = sinon.spy();
      let spy2 = sinon.spy();
      let spy3 = sinon.spy();

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
      delegator.delegate("/baz", "data3");

      assert(spy1.callCount === 1);
      assert(spy2.callCount === 1);
      assert(spy3.callCount === 0);

      // dispatch baz/
      delegator.delegate("baz/", "data4");

      assert(spy1.callCount === 1);
      assert(spy2.callCount === 1);
      assert(spy3.callCount === 0);
    });
  });
});
