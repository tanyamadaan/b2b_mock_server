import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";

export const jwtStrategy = new JWTStrategy({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey   : process.env.JWT_SECRET
},
function (jwtPayload, cb) {
  return cb(null, {id: jwtPayload.id});
}
)