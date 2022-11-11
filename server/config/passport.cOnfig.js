const passport = require("passport");
const passportJwt = require("passport-jwt");
const User = require("../model/User");

const ExtractJwt = passportJwt.ExtractJwt;
const JWTStrategy = passportJwt.Strategy;

passport.use(
  new JWTStrategy(
    {
      secretOrKey: process.env.JWT_SECRET,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    },
    async (jwt_payload, done) => {
      try {
        const user = await User.findById(jwt_payload.id);
        if (user) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      } catch (error) {
        return done(error, false);
      }
    }
  )
);
