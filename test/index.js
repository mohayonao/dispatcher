import assert from "power-assert";
import index from "../src";
import Dispatcher from "../src/Dispatcher";
import Delegator from "../src/Delegator";
import Duplex from "../src/Duplex";

describe("index", () => {
  describe("classes", () => {
    it("works", () => {
      assert(index === Dispatcher);
      assert(index.Delegator === Delegator);
      assert(index.Duplex === Duplex);
    });
  });
});
