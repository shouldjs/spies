var should = require('should');
require('./should-spies');

it('should allow to create spy, that record its calls', function() {
  var s1 = should.spy();
  s1.called.should.be.false();
  s1();
  s1.called.should.be.true();
});

it('should allow to assert on spy state', function() {
  var spy = should.spy();

  spy.should.not.be.called();

  spy(1, 2, 3);

  spy.should.be.called();

  spy.should.be.calledWith(1, 2, 3);

  var obj = {};

  spy.call(obj);

  spy.should.be.calledOn(obj);
});

it('should check call order between 2 spies', function() {
  var spy1 = should.spy();
  var spy2 = should.spy();

  spy1();
  spy2();

  spy2.should.be.calledAfter(spy1);
  spy1.should.be.calledBefore(spy2);
});
