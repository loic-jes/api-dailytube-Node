const dev = require("./dev.config");
const prod = require("./prod.config");

if (process.env.NODE_ENV === 'prod') {
    module.exports = prod;
}
else {
    module.exports = dev;
}