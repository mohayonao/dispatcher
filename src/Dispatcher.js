import EventEmitter from "@mohayonao/event-emitter";

const SUBSCRIPTIONS = typeof Symbol !== "undefined" ? Symbol("SUBSCRIPTIONS") : "_@mohayonao/dispatcher:SUBSCRIPTIONS";
const EVERYTHING = typeof Symbol !== "undefined" ? Symbol("EVERYTHING") : "_@mohayonao/dispatcher:EVERYTHING";

class Dispatcher extends EventEmitter {
  constructor() {
    super();

    this[SUBSCRIPTIONS] = [];
  }

  register(address, subscription) {
    let index, delegator;

    if (typeof subscription === "undefined") {
      subscription = address;
      address = EVERYTHING;
    }

    index = indexOfSubscription(this[SUBSCRIPTIONS], address, subscription);

    if (index !== -1) {
      return;
    }

    if (subscription && typeof subscription.delegate === "function") {
      delegator = subscription;
    } else if (typeof subscription === "function") {
      if (typeof address === "string" && address[0] === "/") {
        delegator = {
          address: address,
          subscription: subscription,
          delegate: function(_address, _data) {
            if (_address === address) {
              subscription(_data, _address);
            }
          },
        };
      } else if (address === EVERYTHING) {
        delegator = {
          address: address,
          subscription: subscription,
          delegate: function(_address, _data) {
            subscription(_data, _address);
          },
        };
      }
    }

    if (delegator) {
      this[SUBSCRIPTIONS].push(delegator);
    }
  }

  unregister(address, subscription) {
    let index;

    if (typeof subscription === "undefined") {
      subscription = address;
      address = EVERYTHING;
    }

    index = indexOfSubscription(this[SUBSCRIPTIONS], address, subscription);

    if (index !== -1) {
      this[SUBSCRIPTIONS].splice(index, 1);
    }
  }

  dispatch(address, data) {
    let subscriptions, i, imax;

    if (typeof address === "string" && address[0] === "/") {
      subscriptions = this[SUBSCRIPTIONS];

      for (i = 0, imax = subscriptions.length; i < imax; i++) {
        subscriptions[i].delegate(address, data);
      }
    }
  }
}

class Delegator extends EventEmitter {
  delegate(address, data) {
    if (typeof address === "string" && address[0] === "/") {
      if (typeof this[address] === "function") {
        this[address](data);
      }
    }
  }
}

Dispatcher.Delegator = Delegator;

function indexOfSubscription(subscriptions, address, subscription) {
  let i, imax;

  for (i = 0, imax = subscriptions.length; i < imax; i++) {
    if (subscriptions[i] === subscription) {
      return i;
    }
    if (subscriptions[i].address === address && subscriptions[i].subscription === subscription) {
      return i;
    }
  }

  return -1;
}

export default Dispatcher;
