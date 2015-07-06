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
_Also implements methods from the interface [@mohayonao/event-emitter](https://github.com/mohayonao/event-emitter)._

- `subscribe(address: string, subscription: function): void`
- `subscribe({ delegate: function }): void`
- `unsubscribe(address: string, subscription: function): void`
- `unsubscribe({ delegate: function }): void`
- `dispatch(address: string, data: any): void`
- `delegate(address: string, data: any): void`

`address: string` must start with "/".

## Messaging Protocol
```
+--------+                  +-------------+
| source | <-- subscribe -- | destination |
|        | --- dispatch --> |             |
+--------+                  +-------------+

interface souce {
  subscribe(address: string, subscription: function): void;
  subscribe({ delegate: function }): void;
  dispatch(address: string, data: any): void;
}

interface destination {
  delegate(address: string, data: any): void;
}
```

```js
let publisher = new Dispatcher();
let subscriber = new Dispatcher();

// define action of address
subscriber["/message/view"] = (message) => {
  console.log(`received: ${message}`);
};

publisher.subscribe(subscriber);

publisher.dispatch("/message/view", "hello!");
// -> call subscriber.delegate("/message/view", "hello!")
// => "received: hello!"
```

## License
MIT
