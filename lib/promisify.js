const fs = require("fs");
const bluebird = require("bluebird");
const redis = require("redis");

bluebird.promisifyAll(fs);
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);
global.Promise = bluebird;
