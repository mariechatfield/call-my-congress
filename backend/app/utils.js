/* eslint-env node */
/* global Promise */

const request = require('request');
const querystring = require('querystring');

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

module.exports = {
  AppError,
  buildURL,
  performGETRequest
};
