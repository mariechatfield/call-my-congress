- Some notes on Redis for Node.js and installing on Heroku! -

When switching from a cache held on the server memory, to a Redis database cache, there are a few things to note:

### Some Notes
1. The keys used to store data in the cache are the same. We will continue using the same pattern.
2. Previously, values were stored as JSON objects.  Redis only allows string values, so we are converting the JSON to a string using JSON.stringify before storing to the database.  Redis has an additional hash datatype, with commands HSET and HGET, but only allows one level of nesting and would still require converting to string, so I decided on the classic Redis SET/GET. [Read about Hset here](https://redis.io/commands/hset).
3. The default behavior for the Redis GET command involves a callback, which can get messy.  The `promisify` helper from Node.js is used to convert this into a promise for easier calls.
4. Rather than using the standard `set` function, we are using `setex` which allows us to set an expiration time in milliseconds for that key.
5. When calling `get` for a value that is expired or does not exist, `null` is returned rather than an error.  All results are in strings, so JSON.parse is used to convert it to a useable format.  If the result is null, JSON.parse(null) returns null.
6. The `api-cache.js` file is a little messier now since it's dealing with promises.  I would be down to pair on a refactor if you have ideas! My main focus was getting the functionality working.

### Implementing on Heroku
1. The Heroku Redis Add-On will need provisioned for the backend server. I believe this can be done through the UI, or you can follow the instructions using the Heroku CLI [here](https://devcenter.heroku.com/articles/heroku-redis#provisioning-the-add-on).

2. Once the Redis Add-On is created, a `REDIS_URL` will be available in the server environment.  This is used in `cache.js` to create the Redis client.  When running locally, it will pass a null value to the Redis.createClient and run on port `6379`.  Read more on the Node.js Redis client [here](https://github.com/NodeRedis/node_redis).  Once deployed, you should see 'Redis client connected' logged.  If there is an error it will log it.