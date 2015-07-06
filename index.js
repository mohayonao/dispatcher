"use strict";

var EventEmitter = require("@mohayonao/event-emitter");

var SUBSCRIPTIONS = typeof Symbol !== "undefined" ? Symbol("SUBSCRIPTIONS") : "_@mohayonao/dispatcher:SUBSCRIPTIONS";

function Dispatcher() {
  EventEmitter.call(this);

  this[SUBSCRIPTIONS] = [];
}

Dispatcher.prototype = Object.create(EventEmitter.prototype, {
  constructor: { value: Dispatcher, enumerable: false, writable: true, configurable: true },
});

Dispatcher.prototype.subscribe = function(address, subscription) {
  var index, delegator;

  if (typeof subscription === "undefined") {
    subscription = address;
    address = "";
  }

  index = indexOfSubscription(this[SUBSCRIPTIONS], address, subscription);

  if (index !== -1) {
    return;
  }

  if (subscription && typeof subscription.delegate === "function") {
    delegator = subscription;
  } else if (typeof address === "string" && address[0] === "/" && typeof subscription === "function") {
    delegator = {
      address: address,
      subscription: subscription,
      delegate: function(_address, _data) {
        if (_address === address) {
          subscription(_data);
        }
      },
    };
  }

  if (delegator) {
    this[SUBSCRIPTIONS].push(delegator);
  }
};

Dispatcher.prototype.unsubscribe = function(address, subscription) {
  var index;

  if (typeof subscription === "undefined") {
    subscription = address;
    address = "";
  }

  index = indexOfSubscription(this[SUBSCRIPTIONS], address, subscription);

  if (index !== -1) {
    this[SUBSCRIPTIONS].splice(index, 1);
  }
};

Dispatcher.prototype.dispatch = function(address, data) {
  var subscriptions, i, imax;

  if (typeof address === "string" && address[0] === "/") {
    subscriptions = this[SUBSCRIPTIONS];

    for (i = 0, imax = subscriptions.length; i < imax; i++) {
      subscriptions[i].delegate(address, data);
    }
  }
};

Dispatcher.prototype.delegate = function(address, data) {
  if (typeof address === "string" && address[0] === "/") {
    if (typeof this[address] === "function") {
      this[address](data);
    }
  }
};

function indexOfSubscription(subscriptions, address, subscription) {
  var i, imax;

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

module.exports = Dispatcher;
