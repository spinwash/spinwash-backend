const User = require('../model/auth.model');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const _ = require('lodash');
const { OAuth2Client } = require('google-auth-library');
const { validationResult } = require('express-validator');
const { errorHandler } = require('../helpers/dbErrorHandling');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.MAIL_KEY);

exports.registerController = (req, res) => {
  const { name, email, password } = req.body;
  const errors = validationResult(req);

  console.log(req.body);
  //custom validation
  if (!errors.isEmpty()) {
    const firstError = errors.array().map((error) => error.msg)[0];
    console.log('inside empty error');
    return res.status(422).json({
      errors: firstError,
    });
  } else {
    User.findOne({
      email,
    }).exec((err, user) => {
      if (user) {
        return res.status(400).json({
          message: 'Email is taken',
        });
      } else {
        console.log(err);
      }
    });

    //GENERATE TOKEN
    const token = jwt.sign(
      {
        name,
        email,
        password,
      },
      process.env.JWT_ACCOUNT_ACTIVATION,
      {
        expiresIn: '5m',
      }
    );
    console.log(token);

    // Email Data
    const emailData = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Account activation link',
      html: `
                <h1>Please use the following to activate your account</h1>
                <p>${process.env.CLIENT_URL}/users/activate/${token}</p>
                <hr />
                <p>This email may containe sensetive information</p>
                <p>${process.env.CLIENT_URL}</p>
            `,
    };
    // send the email data
    sgMail
      .send(emailData)
      .then((sent) => {
        return res.json({
          message: `Email has been sent to ${email}`,
        });
      })
      .catch((err) => {
        return res.status(400).json({
          success: false,
          errors: errorHandler(err),
        });
      });
  }
};

//activation and save to database
exports.activationController = (req, res) => {
  const { token } = req.body;

  if (token) {
    //verify the token is valid or not or expired
    jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, (err, decoded) => {
      if (err) {
        console.log('Activation error');
        return res.status(401).json({
          errors: 'Expired link. Signup again',
        });
      } else {
        //if valid save to database
        // get name email password from token
        const { name, email, password } = jwt.decode(token);

        console.log(email);
        const user = new User({
          name,
          email,
          password,
        });

        user.save((err, user) => {
          if (err) {
            return res.status(401).json({
              errors: errorHandler(err),
            });
          } else {
            return res.json({
              success: true,
              user: user,
              message: 'Signup success',
            });
          }
        });
      }
    });
  } else {
    return res.json({
      message: 'Error happening please try again',
    });
  }
};

exports.loginController = (req, res) => {
  const { email, password } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstError = errors.array().map((error) => error.msg)[0];
    return res.status(422).json({
      errors: firstError,
    });
  } else {
    // check if user exist
    User.findOne({
      email,
    }).exec((err, user) => {
      if (err || !user) {
        return res.status(400).json({
          errors: 'Email does not exist. Please register',
          at: 'email',
        });
      }
      // authenticate
      if (!user.authenticate(password)) {
        return res.status(400).json({
          errors: 'Wrong Password. Try Again',
          at: 'password',
        });
      }
      // generate a token and send to client
      const token = jwt.sign(
        {
          _id: user._id,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: '7d', // token valud for 7 days set [] remember me and set it for 30 days
        }
      );
      const { _id, profilePicture, phoneNumber, name, test, email, role } =
        user;

      return res.json({
        token,
        user: {
          _id,
          profilePicture,
          phoneNumber,
          test,
          name,
          email,
          role,
        },
      });
    });
  }
};

exports.forgotPasswordController = (req, res) => {
  const { email } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const firstError = errors.array().map((error) => error.msg)[0];
    return res.status(422).json({
      errors: firstError,
    });
  } else {
    // find if the user exists
    User.findOne(
      {
        email,
      },
      (err, user) => {
        if (err || !user) {
          return res.status(400).json({
            error: 'Email does not exist',
          });
        }

        const token = jwt.sign(
          {
            _id: user._id,
          },
          process.env.JWT_RESET_PASSWORD,
          {
            expiresIn: '10m',
          }
        );

        const emailData = {
          from: 'spinwash <mailgun@spinwash.xyz>',
          to: email,
          subject: 'spinwash Password Reset',
          html: ``,
        };

        return user.updateOne(
          {
            resetPasswordLink: token,
          },
          (err, success) => {
            if (err) {
              console.log('RESET PASSWORD LINK ERROR', err);
              return res.status(400).json({
                error:
                  'Database connection error on user password forgot request',
              });
            } else {
              mg.messages
                .create('spinwash.xyz', emailData)
                .then(() => {
                  return res.json({
                    message: `Email has been sent to ${email}. Follow the instruction to activate your account`,
                  });
                })
                .catch((err) => {
                  return res.status(400).json({
                    error: errorHandler(err),
                  });
                });
            }
          }
        );
      }
    );
  }
};

exports.resetPasswordController = (req, res) => {
  const { resetPasswordLink, newPassword } = req.body;
  console.log(newPassword);

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const firstError = errors.array().map((error) => error.msg)[0];
    return res.status(422).json({
      errors: firstError,
    });
  } else {
    if (resetPasswordLink) {
      jwt.verify(
        resetPasswordLink,
        process.env.JWT_RESET_PASSWORD,
        function (err, decoded) {
          if (err) {
            return res.status(400).json({
              error: 'Expired link. Try again',
            });
          }

          User.findOne(
            {
              resetPasswordLink,
            },
            (err, user) => {
              if (err || !user) {
                return res.status(400).json({
                  error: 'Something went wrong. Try later',
                });
              }

              const updatedFields = {
                password: newPassword,
                resetPasswordLink: '',
              };

              user = _.extend(user, updatedFields);

              user.save((err, result) => {
                if (err) {
                  return res.status(400).json({
                    error: 'Error resetting user password',
                  });
                }
                res.json({
                  message: `Great! Now you can login with your new password`,
                });
              });
            }
          );
        }
      );
    }
  }
};

// Google Login
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.googleController = (req, res) => {
  const { idToken } = req.body;
  //console.log(idToken);
  client
    .verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    })
    .then((response) => {
      const { email_verified, name, email, picture } = response.payload;
      if (email_verified) {
        User.findOne({ email }).exec((err, user) => {
          if (user) {
            //find if the email already exists
            console.log('user exists 😊');
            const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
              expiresIn: '7d',
            });
            const { _id, email, name, profilePicture, role } = user;
            return res.json({
              //send response to client side (token and user info)
              token,
              user: { _id, email, name, profilePicture, role },
            });
          } else {
            console.log('user does not exits 🤭');
            //if user not exists we will save in database and generate password for it
            let password = email + process.env.JWT_SECRET;
            const profilePicture = picture;
            user = new User({ name, email, password, profilePicture }); //create new user object with google data
            user.save((err, data) => {
              if (err) {
                console.log('ERROR GOOGLE LOGIN ON USER SAVE - ', err);
                return res.status(400).json({
                  error: 'User signup failed with google',
                });
              }
              const token = jwt.sign(
                { _id: data._id },
                process.env.JWT_SECRET,
                { expiresIn: '7d' }
              );
              const { _id, email, name, profilePicture, role } = data;
              return res.json({
                token,
                user: { _id, email, name, profilePicture, role },
              });
            });
          }
        });
      } else {
        return res.status(400).json({
          error: 'Google login failed. Try again',
        });
      }
    })
    .catch((error) => {
      console.log('Error is ', error);
    });
};
