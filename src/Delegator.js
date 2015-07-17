import EventEmitter from "@mohayonao/event-emitter";

export default class Delegator extends EventEmitter {
  delegate(address, data) {
    if (typeof address === "string" && address[0] === "/") {
      if (typeof this[address] === "function") {
        this[address](data);
      }
    }
  }
}
