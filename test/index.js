import assert from "power-assert";
import index, { Dispatcher, Delegator, Duplex } from "../src";
import Dispatcher2 from "../src/Dispatcher";
import Delegator2 from "../src/Delegator";
import Duplex2 from "../src/Duplex";

describe("index", () => {
  describe("classes", () => {
    it("works", () => {
      assert(index === Dispatcher2);
      assert(index.Dispatcher === Dispatcher2);
      assert(index.Delegator === Delegator2);
      assert(index.Duplex === Duplex2);
      assert(Dispatcher === Dispatcher2);
      assert(Delegator === Delegator2);
      assert(Duplex === Duplex2);
    });
  });
});
