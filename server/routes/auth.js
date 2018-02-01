const express = require('express');
const validator = require('validator');
const passport = require('passport');
const path = require('path');
const router = new express.Router();
var async = require('async');
const User = require('mongoose').model('User');
const crypto = require('crypto');
// var hbs = require('nodemailer-express-handlebars'),
var email = process.env.MAILER_EMAIL_ID || 'sridharan.219@gmail.com',
  pass = process.env.MAILER_PASSWORD || 'lushwave21994',
  nodemailer = require('nodemailer');
var smtpTransport = nodemailer.createTransport({
  service: process.env.MAILER_SERVICE_PROVIDER || 'Gmail',
  auth: {
    user: email,
    pass: pass
  } 
});
// var handlebarsOptions = {
//   viewEngine: 'handlebars',
//   viewPath: path.resolve('./'),
//   extName: '.html'
// };
// smtpTransport.use('compile', hbs(handlebarsOptions));  


/**
 * Validate the sign up form
 *
 * @param {object} payload - the HTTP body message
 * @returns {object} The result of validation. Object contains a boolean validation result,
 *                   errors tips, and a global message for the whole form.
 */
function validateSignupForm(payload) {
  const errors = {};
  let isFormValid = true;
  let message = '';

  if (!payload || typeof payload.email !== 'string' || !validator.isEmail(payload.email)) {
    isFormValid = false;
    errors.email = 'Please provide a correct email address.';
  }

  if (!payload || typeof payload.password !== 'string' || payload.password.trim().length < 8) {
    isFormValid = false;
    errors.password = 'Password must have at least 8 characters.';
  }

  if (!payload || typeof payload.name !== 'string' || payload.name.trim().length === 0) {
    isFormValid = false;
    errors.name = 'Please provide your name.';
  }

  if (!isFormValid) {
    message = 'Check the form for errors.';
  }

  return {
    success: isFormValid,
    message,
    errors
  };
}

/**
 * Validate the login form
 *
 * @param {object} payload - the HTTP body message
 * @returns {object} The result of validation. Object contains a boolean validation result,
 *                   errors tips, and a global message for the whole form.
 */
function validateLoginForm(payload) {
  const errors = {};
  let isFormValid = true;
  let message = '';

  if (!payload || typeof payload.email !== 'string' || payload.email.trim().length === 0) {
    isFormValid = false;
    errors.email = 'Please provide your email address.';
  }

  if (!payload || typeof payload.password !== 'string' || payload.password.trim().length === 0) {
    isFormValid = false;
    errors.password = 'Please provide your password.';
  }

  if (!isFormValid) {
    message = 'Check the form for errors.';
  }

  return {
    success: isFormValid,
    message,
    errors
  };
}

router.post('/signup', (req, res, next) => {
  const validationResult = validateSignupForm(req.body);
  if (!validationResult.success) {
    return res.status(400).json({
      success: false,
      message: validationResult.message,
      errors: validationResult.errors
    });
  }


  return passport.authenticate('local-signup', (err, token, userData) => {
    if (err) {
      if (err.name === 'MongoError' && err.code === 11000) {
        // the 11000 Mongo code is for a duplication email error
        // the 409 HTTP status code is for conflict error
        return res.status(409).json({
          success: false,
          message: 'Check the form for errors.',
          errors: {
            email: 'This email is already taken.'
          }
        });
      }

      return res.status(400).json({
        success: false,
        message: 'Could not process the form.'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'You have successfully signed up! Now you should be able to log in.',
      token,
      user: {name : userData.name,
             email : userData.email}

    });
  })(req, res, next);
});

router.post('/login', (req, res, next) => {
  const validationResult = validateLoginForm(req.body);
  if (!validationResult.success) {
    return res.status(400).json({
      success: false,
      message: validationResult.message,
      errors: validationResult.errors
    });
  }


  return passport.authenticate('local-login', (err, token, userData) => {
    if (err) {
      if (err.name === 'IncorrectCredentialsError') {
        return res.status(400).json({
          success: false,
          message: err.message
        });
      }

      return res.status(400).json({
        success: false,
        message: 'Could not process the form.'
      });
    }


    return res.json({
      success: true,
      message: 'You have successfully logged in!',
      token,
      user: {name : userData.name,
             email : userData.email}
    });
  })(req, res, next);
});

router.get('/forgot-password', function(req, res) {
  async.waterfall([
    function(done) {
      User.findOne({
        email: req.query.email
      }).exec(function(err, user) {
        if (user) {
          done(err, user);
        } else {
          done('User not found.');
        }
      });
    },
    function(user, done) {
      // create the random token
      crypto.randomBytes(20, function(err, buffer) {
        var token = buffer.toString('hex');
        done(err, user, token);
      });
    },
    function(user, token, done) {
      User.findByIdAndUpdate({ _id: user._id }, { reset_password_token: token, reset_password_expires: Date.now() + 86400000 }, { new: true }).exec(function(err, new_user) {
        done(err, token, new_user);
      });
    },
    function(token, user, done) {
      // var email = 'sridharan.219@gmail.com',
      // pass = 'lushwave21994';
      var url= 'http://localhost:3000/reset-password?token=' + token;
      var data = {
        to: "sridharan.213@gmail.com",
        from: email,
        subject: 'Password help has arrived!',
        text: "hi: "+ url
      };

      smtpTransport.sendMail(data, function(err) {
        if (!err) {
          return res.json({ message: 'Kindly check your email for further instructions' });
        } else {
          return done(err);
        }
      });
    }
  ], function(err) {
    return res.status(422).json({ message: err });
  });
});    
router.get('/reset-password',function(req, res, next) {
  User.findOne({
    reset_password_token: req.query.token,
    reset_password_expires: {
      $gt: Date.now()
    }
  }).exec(function(err, user) {
    if (!err && user) {
      if (req.query.newPassword === req.query.verifyPassword) {
          // user.password = bcrypt.hashSync(req.body.newPassword, 10);
            user.password = req.query.newPassword;

            user.reset_password_token = undefined;
            user.reset_password_expires = undefined;
            user.save(function(err) { 
              if (err) {
                return res.status(422).send({
                  message: err
                });
              } else {
                var data = {
                  to: "sridharan.213@gmail.com",
                  from: email,
                  subject: 'Password Reset Confirmation',
                  text: "reset done!!!"
                };

                smtpTransport.sendMail(data, function(err) {
                  if (!err) {
                    return res.json({ message: 'Password reset' });
                  } else {
                    return done(err);
                  }
                });
              }
            });
        
      } else {
        return res.status(422).send({
          message: 'Passwords do not match'
        });
      }
    } else {
      return res.status(400).send({
        message: 'Password reset token is invalid or has expired.'
      });
    }
  });
});


module.exports = router;
