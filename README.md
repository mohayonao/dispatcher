# DISPATCHER
[![Build Status](http://img.shields.io/travis/mohayonao/dispatcher.svg?style=flat-square)](https://travis-ci.org/mohayonao/dispatcher)
[![NPM Version](http://img.shields.io/npm/v/@mohayonao/dispatcher.svg?style=flat-square)](https://www.npmjs.org/package/@mohayonao/dispatcher)
[![License](http://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)](http://mohayonao.mit-license.org/)

> simple dispatcher

## Installation

Node.js

```sh
npm install @mohayonao/dispatcher
```

## API
### Dispatcher
- `constructor()`

#### Instance methods
- `register(address: string, subscription: function): void`
- `register(subscription: function): void`
- `register({ delegate: function }): void`
- `unregister(address: string, subscription: function): void`
- `unregister(subscription: function): void`
- `unregister({ delegate: function }): void`
- `dispatch(address: string, data: any): void`

### Dispatcher.Delegator
- `constructor()`

#### Instance methods
- `delegate(address: string, data: any): void`

### Dispatcher.Duplex
- `constructor()`

## Messaging Protocol
```
+--------+                  +-------------+
| source | <-- register --- | destination |
|        | --- dispatch --> |             |
+--------+                  +-------------+

interface souce {
  register(address: string, subscription: function): void;
  register(subscription: function): void;
  register({ delegate: function }): void;
  dispatch(address: string, data: any): void;
}

interface destination {
  delegate(address: string, data: any): void;
}
```

`address: string` must start with "/".

```js
let publisher = new Dispatcher();
let subscriber = new Dispatcher.Delegator();

// define action of address
subscriber["/message/view"] = (message) => {
  console.log(`received: ${message}`);
};

publisher.register(subscriber);

publisher.dispatch("/message/view", "hello!");
// -> call subscriber.delegate("/message/view", "hello!")
// => "received: hello!"
```

## License
MIT
