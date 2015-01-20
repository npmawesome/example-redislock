/**
 * example-redislock
 * http://npmawesome.com/posts/foo
 *
 * Copyright(c) 2015 npmawesome.com
 *
 * MIT Licensed
 */

var redis = require('redis');
var redislock = require('redislock');

var client = redis.createClient();
var lock = redislock.createLock(client, {
  timeout: 20000,
  retries: 3,
  delay: 100
});

function doStuff(done) {
  lock.acquire('my:lock-name', function (err) {
    if (err) {
      console.log('Failed to get a lock...', err.message);
      return;
    }

    doStuff(done);

    lock.release(function (err) {
      console.log('Do work here...');
      done();
    });
  });
}

doStuff(function() {
  console.log('Done working...');
  client.end();
});
