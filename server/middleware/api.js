// PASSPORT CONFIGURATIONS
require("../config/passport.cOnfig");
const passport = require("passport");
const api = passport.authenticate("jwt", { session: false });

module.exports = api;
