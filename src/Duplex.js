import Dispatcher from "./Dispatcher";

export default class Duplex extends Dispatcher {
  delegate(address, data) {
    if (typeof address === "string" && address[0] === "/") {
      if (typeof this[address] === "function") {
        this[address](data);
      }
    }
  }
}
