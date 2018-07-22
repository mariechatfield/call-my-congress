/* eslint-env node */
/* global Promise */

const request = require('request');
const querystring = require('querystring');
const Log = require('log');

function AppError(message) {
  this.name = 'AppError';
  this.message = message || 'Default Message';
  this.stack = (new Error()).stack;
}
AppError.prototype = Object.create(Error.prototype);
AppError.prototype.constructor = AppError;

function buildURL(base, params) {
  return `${base}?${querystring.stringify(params)}`;
}

function performGETRequest(options, processResult, attemptParse = true) {
  return new Promise((resolve, reject) => {
    request.get(options, function (error, response, body) {
      try {
        if (!error && response.statusCode === 200) {
          if (attemptParse) {
            const result = JSON.parse(body);
            resolve(processResult(result));
          } else {
            resolve(processResult(body));
          }
        } else {
          reject(error);
        }
      } catch (error) {
        reject(error);
      }
    });
  });
}

function getLogger() {
  const loglevel = process.env.LOGLEVEL;

  if (loglevel) {
    return new Log(loglevel);
  }

  return new Log();
}

module.exports = {
  AppError,
  buildURL,
  getLogger,
  performGETRequest
};
