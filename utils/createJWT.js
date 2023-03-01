const jwt = require("jsonwebtoken");

module.exports = (userId) => {
    return jwt.sign({ userId: userId }, `AbCdEfGhIjKlMnOPYT`, { expiresIn: "240h" }); // expires in 240 hours
}