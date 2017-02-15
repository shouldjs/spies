# spies
Small pretty basic spies for should.js

# Installation

Just call this module after should.js

# Usage

```js
var spy = should.spy();

spy.should.not.be.called();

spy(1, 2, 3);

spy.should.be.calledWith(1, 2, 3);

var obj = {};

spy.call(obj);

spy.should.be.calledOn(obj);
```

# API

`should.spy([funcion])` - creates spy that optionally call passed function

`should.spy.on(obj, methodName)` - creates spy replaces methodName of obj

`should.spy.returns(value)` - creates spy that always return value

`should.spy.throws(err)`, `should.spy.throws(ErrorConstructor, [message])`, `should.spy.throws([message])` - create spy that always throw error

# Assertions

```js
var spy = should.spy();

// called checks if spy was called
spy.should.not.be.called();

spy();

spy.should.be.called();

spy(1, 2, 3);

// checks if spy was called with given arguments
spy.should.be.calledWith(1, 2, 3);

var obj = {}
spy.call(obj);
spy.should.be.calledOn(obj);


var spy1 = should.spy();
var spy2 = should.spy();

spy1();
spy2();

spy2.should.be.calledAfter(spy1);
spy1.should.be.calledBefore(spy2);
```
