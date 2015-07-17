import EventEmitter from "@mohayonao/event-emitter";

const SUBSCRIPTIONS = typeof Symbol !== "undefined" ? Symbol("SUBSCRIPTIONS") : "_@mohayonao/dispatcher:SUBSCRIPTIONS";
const EVERYTHING = typeof Symbol !== "undefined" ? Symbol("EVERYTHING") : "_@mohayonao/dispatcher:EVERYTHING";

export default class Dispatcher extends EventEmitter {
  constructor() {
    super();

    this[SUBSCRIPTIONS] = [];
  }

  register(address, subscription) {
    if (typeof subscription === "undefined") {
      subscription = address;
      address = EVERYTHING;
    }

    let index = indexOfSubscription(this[SUBSCRIPTIONS], address, subscription);

    if (index !== -1) {
      return;
    }

    let delegator = buildDelegator(address, subscription);

    if (delegator) {
      this[SUBSCRIPTIONS].push(delegator);
    }
  }

  unregister(address, subscription) {
    if (typeof subscription === "undefined") {
      subscription = address;
      address = EVERYTHING;
    }

    let index = indexOfSubscription(this[SUBSCRIPTIONS], address, subscription);

    if (index !== -1) {
      this[SUBSCRIPTIONS].splice(index, 1);
    }
  }

  dispatch(address, data) {
    if (typeof address === "string" && address[0] === "/") {
      let subscriptions = this[SUBSCRIPTIONS];

      for (let i = 0, imax = subscriptions.length; i < imax; i++) {
        subscriptions[i].delegate(address, data);
      }
    }
  }
}

function buildDelegator(address, subscription) {
  if (subscription && typeof subscription.delegate === "function") {
    return subscription;
  }

  if (typeof subscription !== "function") {
    return null;
  }

  if (typeof address === "string" && address[0] === "/") {
    return {
      address: address,
      subscription: subscription,
      delegate(_address, _data) {
        if (_address === address) {
          subscription(_data, _address);
        }
      },
    };
  }

  if (address === EVERYTHING) {
    return {
      address: address,
      subscription: subscription,
      delegate(_address, _data) {
        subscription(_data, _address);
      },
    };
  }
}

function indexOfSubscription(subscriptions, address, subscription) {
  for (let i = 0, imax = subscriptions.length; i < imax; i++) {
    if (subscriptions[i] === subscription) {
      return i;
    }
    if (subscriptions[i].address === address && subscriptions[i].subscription === subscription) {
      return i;
    }
  }

  return -1;
}
