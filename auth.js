const passport = require('passport');

const localStrategy = require('passport-local').Strategy;
const UserModel = require('./users.model');
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
passport.use(
    'login',
    new localStrategy(
      {
        usernameField: 'user',
        passwordField: 'password'
      },
      async (user, password, done) => {
        try {
          const authuser = await UserModel.findOne({ user });
            console.log(authuser)
          if (!authuser) {
            return done(null, false, { message: 'User not found' });
          }
  
          const validate = await authuser.isValidPassword(password);
  
          if (!validate) {
            return done(null, false, { message: 'Wrong Password' });
          }
  
          return done(null, authuser, { message: 'Logged in Successfully' });
        } catch (error) {
          return done(error);
        }
      }
    )
  );




passport.use(
  new JWTstrategy(
    {
      secretOrKey: 'TOP_SECRET',
      jwtFromRequest: ExtractJWT.fromExtractors([(req) => (req.cookies.jwt)])
    },
    async (token, done) => {
       
      try {
        
        return done(null, token.user);
      } catch (error) {
        
        done(error);
      }
    }
  )
);