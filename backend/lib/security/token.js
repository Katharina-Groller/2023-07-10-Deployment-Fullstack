// const promisify = fn => (...args) => new Promise((resolve, reject) => {
//     fn(...args, (error, value) => {
//       if (error) {
//         reject(error);
//       } else {
//         resolve(value);
//       }
//   });
// });

const { promisify } = require("util");

const jwt = require("jsonwebtoken");

const sign = promisify(jwt.sign);

const createToken = async (payload, secret) => {
    const token = await sign(payload, secret);
    return token;
};

const verify = promisify(jwt.verify);

const validateToken = async (token, secret) => {
    try {
        const decoded = await verify(token, secret);
        return decoded;
    } catch (error) {
        throw new Error("Invalid token");
    }
};

module.exports = { createToken, validateToken };
