(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['should'], factory);
  } else if (typeof module === 'object' && module.exports) {
    factory(require('should'));
  } else {
    factory(root.should);
  }
}(this, function(should) {
  var t = should.modules.type;
  var format = should.modules.format;


  var ARRAY_SLICE = Array.prototype.slice;

  var callId = 0;


  function createProxyFunction(func) {
    var proxyFunc = function() {
      var args = ARRAY_SLICE.call(arguments);
      var call = { args: args, context: this, id: callId++ };
      proxyFunc.calls.push(call);
      return func.apply(this, args);
    };

    Object.defineProperties(proxyFunc, {
      called: {
        get: function() {
          return this.calls.length > 0;
        }
      },

      isSpy: {
        value: true,
        configurable: false
      },

      lastCall: {
        get: function() {
          if (this.called) {
            return this.calls[this.calls.length - 1];
          }
        }
      }
    });

    proxyFunc.reset = function() {
      this.calls = [];
    };

    proxyFunc.reset();

    return proxyFunc;
  }

  function spy(func) {
    var proxy = createProxyFunction(func || function() {});
    return proxy;
  }

  var SPY = new t.Type(t.OBJECT, 'should-spy');

  t.checker.addBeforeFirstMatch(function() {}, function(obj) {
    if (obj.isSpy) {
      return SPY;
    }
  });

  format.Formatter.addType(SPY, function() {
    return '{ Spy }';
  });

  /**
   * should spy
   * @param {function} [func] Optional function to be called
   * @returns {Spy}
   * @memberOf should
   * @static
   */
  should.spy = spy;

  function on(obj, methodName) {
    var originalFunc = obj[methodName];
    var proxy = spy(obj[methodName]);
    obj[methodName] = proxy;
    proxy.restore = function() {
      obj[methodName] = originalFunc;
    };
    return proxy;
  }

  spy.on = on;

  function returns(something) {
    return spy(function() {
      return something;
    });
  }

  spy.returns = returns;

  function throws(err, msg) {
    switch (typeof err) {
      case 'string':
        err = new Error(msg);
        break;
      case 'function':
        msg = (typeof msg !== 'undefined') ? msg : 'Error thrown';
        err = new err(msg);
        break;
    }
    return spy(function() {
      throw err;
    });
  }

  spy.throws = throws;

  var Assertion = should.Assertion;


  Assertion.add('Spy', function() {
    this.params = { operator: 'is spy' };

    this.have.property('isSpy', true);
  });


  Assertion.add('called', function() {
    this.params = { operator: 'to be called' };

    this.obj.should.be.Spy();

    this.assert(this.obj.called);
  });

  Assertion.add('callCount', function(number) {
    this.params = { operator: 'to be called ' + should.format(number) + ' times' };

    this.obj.should.be.Spy();

    this.have.property('calls').which.has.length(number);
  });

  Assertion.add('calledOn', function(obj) {
    this.params = { operator: 'to be called on ' + should.format(obj) };

    this.obj.should.be.called();

    var lastCall = this.obj.lastCall;
    should(lastCall.context).be.exactly(obj);
  });

  Assertion.add('calledWith', function() {
    this.params = { operator: 'to be called with ' + should.format(arguments) };

    this.obj.should.be.called();

    var lastCall = this.obj.lastCall;
    should(lastCall.args).be.eql(ARRAY_SLICE.call(arguments));
  });

  Assertion.add('calledBefore', function(otherSpy) {
    this.params = { operator: 'to be called before ' + should.format(otherSpy) };

    var thisSpy = this.obj;

    thisSpy.should.be.called();
    if (!otherSpy.called) {
      return;
    }

    var thisFirstCall = thisSpy.calls[0];
    var otherLastCall = otherSpy.lastCall;

    this.assert(thisFirstCall.id < otherLastCall.id);
  });

  Assertion.add('calledAfter', function(otherSpy) {
    this.params = { operator: 'to be called after ' + should.format(otherSpy) };

    var thisSpy = this.obj;

    thisSpy.should.be.called();
    otherSpy.should.be.called();

    var thisLastCall = thisSpy.lastCall;
    var otherLastCall = otherSpy.lastCall;

    this.assert(thisLastCall.id > otherLastCall.id);
  });
}));
