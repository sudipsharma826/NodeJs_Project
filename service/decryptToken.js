const jwt = require('jsonwebtoken');
const { promisify } = require('util');
exports.decryptToken = async(token,sceretKey) => {
const decoded = await promisify(jwt.verify)(token, sceretKey);
return decoded;
};