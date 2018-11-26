/* global Promise */

export function getJSON(url) {
  // Adapted from http://youmightnotneedjquery.com/#json
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.open('GET', url, true);

    request.onload = function() {
      try {
        if (request.status >= 200 && request.status < 400) {
          resolve(JSON.parse(request.responseText));
        } else {
          if (request.responseText) {
            reject(JSON.parse(request.responseText));
          } else {
            reject();
          }
        }
      } catch (err) {
        reject();
      }
    };

    request.onerror = function() {
      reject();
    };

    request.send();
  });
}
