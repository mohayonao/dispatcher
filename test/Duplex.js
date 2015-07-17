import assert from "power-assert";
import sinon from "sinon";
import Dispatcher from "../src/Dispatcher";
import Duplex from "../src/Duplex";

describe("Duplex", () => {
  describe("constructor()", () => {
    it("works", () => {
      let delegator = new Duplex();

      assert(delegator instanceof Duplex);
      assert(delegator instanceof Dispatcher);
    });
  });
  describe("#delegate(address: string, data: any): void", () => {
    it("works", () => {
      let dispatcher = new Dispatcher();
      let delegator = new Duplex();
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
