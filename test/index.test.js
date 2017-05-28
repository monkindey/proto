var assert = require('assert');
var protoTrace = require('../index.js');

function Person(name) {
  this.name = name;
}

Person.prototype.introduce = function() {
  console.log(`I am ${this.name}`);
};

// 2
class Player extends Person {}
class Programmer extends Person {}

// 3
class NBAPlayer extends Player {}

// instantiate
var player = new NBAPlayer('nash');

describe('the proto of player object', function() {
  it('should grap four parents', function() {
    var proto = protoTrace(player).map(function(c) {
      return c.name;
    });
    assert.deepEqual(proto, [
      'NBAPlayer Instance',
      'NBAPlayer',
      'Player',
      'Person'
    ]);
  });
});
