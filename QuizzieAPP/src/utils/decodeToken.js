// decodeToken.js
const jwt_decode = require('jwt-decode');

export function decodeToken(token) {
  return jwt_decode(token);
}
