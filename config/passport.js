// config/passport.js
// creates a collection in Mongo with all users information

// load all the things we need
var LocalStrategy   = require('passport-local').Strategy;

// load up the user model
var User       		= require('../app/models/user');

var fieldsToValidValues = {
  location: {
    'East-Coast': true,
    'West-Coast': true,
    'South-Coast': true,
    'Mid-West': true
  },
  month: {
    'January': true,
    'February': true,
    'March': true,
    'April': true,
    'May': true,
    'June': true,
    'July': true,
    'August': true,
    'September': true,
    'October': true,
    'November': true,
    'December': true
  },
  color: {
    'red': true,
    'orange': true,
    'yellow': true,
    'green': true,
    'blue': true,
    'violet': true,
    'black': true
  },
  personality: {
    'eat': true,
    'tempered': true,
    'persistent': true,
    'curious': true,
    'lose': true,
    'sarcastic': true
  },
  activity1: {
    'sports': true,
    'music': true,
    'gym': true,
    'games': true,
    'hiking': true,
    'cooking': true
  },
  activity2: {
    'sports': true,
    'music': true,
    'gym': true,
    'games': true,
    'hiking': true,
    'cooking': true
  }
};

function isValid(fieldName, val) {
  return !!fieldsToValidValues[fieldName][val];
}

function allFieldsValid(req) {
  let ok = true;
  Object.keys(fieldsToValidValues).forEach(l => {
    if (!isValid(l, req.body[l])) {
      ok = false;
    }
  });
  return ok;
}

// expose this function to our app using module.exports
// exports a fucntion
module.exports = function(passport) {

	// =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

 	// =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
	// by default, if there was no name, it would just be called 'local'

    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) {
		// find a user whose email is the same as the forms email
		// we are checking to see if the user trying to login already exists
        User.findOne({ 'local.email' :  email }, function(err, user) {
            // if there are any errors, return the error
            if (err)
                return done(err);

            // check to see if theres already a user with that email
            if (user) {
                return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
            }
            else if (!allFieldsValid(req)) {
                return done(null, false, req.flash('signupMessage', 'Missing required fields.'));
            }
             else {

				// if there is no user with that email
                // create the user
                var newUser            = new User();

                // set the user's local credentials
                newUser.team = {
                  poke1: '',
                  poke2: '',
                  poke3: '',
                  poke4: '',
                  poke5: '',
                  poke6: ''
                }
                newUser.stats = {
                  location: req.body.location,
                  month: req.body.month,
                  color: req.body.color,
                  personality: req.body.personality,
                  activity1: req.body.activity1,
                  activity2: req.body.activity2
                };
                newUser.local.email    = email;
                newUser.local.password = newUser.generateHash(password); // use the generateHash function in our user model

				// save the user
                newUser.save(function(err) {
                    if (err)
                        throw err;
                    return done(null, newUser);
                });
            }

        });

    }));

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) { // callback with email and password from our form

        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        User.findOne({ 'local.email' :  email }, function(err, user) {
            // if there are any errors, return the error before anything else
            if (err)
                return done(err);

            // if no user is found, return the message
            if (!user)
                return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash

            // if the user is found but the password is wrong
            if (!user.validPassword(password))
                return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

            // all is well, return successful user
            return done(null, user);
        });

    }));

};
