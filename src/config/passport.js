const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const {User} = require('../models/user');
const config = require('./main');

module.exports = function(passport) {
  const opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
  opts.secretOrKey = config.JWT_SECRET;
  passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    console.log(jwt_payload);
    User.findOne({_id: jwt_payload.userId})
    .then((result) => {
      if (result) {
        return done(null, result)
      } else {
        done(null, false);
      }
    })
    .catch( err => {
      console.error('Ooops');
      throw err
    })
  }))
}
