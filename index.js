"use strict";

var EventEmitter = require("@mohayonao/event-emitter");

var SUBSCRIPTIONS = typeof Symbol !== "undefined" ? Symbol("SUBSCRIPTIONS") : "_@mohayonao/dispatcher:SUBSCRIPTIONS";
var EVERYTHING = typeof Symbol !== "undefined" ? Symbol("EVERYTHING") : "_@mohayonao/dispatcher:EVERYTHING";

function Dispatcher() {
  EventEmitter.call(this);

  this[SUBSCRIPTIONS] = [];
}

Dispatcher.prototype = Object.create(EventEmitter.prototype, {
  constructor: { value: Dispatcher, enumerable: false, writable: true, configurable: true },
});

Dispatcher.prototype.register = function(address, subscription) {
  var index, delegator;

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
};

Dispatcher.prototype.unregister = function(address, subscription) {
  var index;

  if (typeof subscription === "undefined") {
    subscription = address;
    address = EVERYTHING;
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

function Delegator() {
  EventEmitter.call(this);
}

Delegator.prototype = Object.create(EventEmitter.prototype, {
  constructor: { value: Delegator, enumerable: false, writable: true, configurable: true },
});

Delegator.prototype.delegate = function(address, data) {
  if (typeof address === "string" && address[0] === "/") {
    if (typeof this[address] === "function") {
      this[address](data);
    }
  }
};

Dispatcher.Delegator = Delegator;

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
