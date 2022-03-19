const User = require('../model/auth.model');
const dotenv = require('dotenv');
dotenv.config();

const formData = require('form-data');
const Mailgun = require('mailgun.js');
const mailgun = new Mailgun(formData);
const client = mailgun.client({
  username: 'spinwash',
  key: process.env.MAILGUN_API_KEY,
  url: 'https://api.eu.mailgun.net',
});

exports.readController = (req, res) => {
  const userId = req.params.id;
  User.findById(userId).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: 'User not found',
      });
    }
    user.hashed_password = undefined;
    user.salt = undefined;
    console.log('fetching user');
    res.json(user);
  });
};

exports.updateController = (req, res) => {
  const {
    name,
    _id,
    phoneNumber,
    profilePicture,
    address,
    preferences,
    beddingPressOnly,
    beddingWashAndFold,
    beddingWashAndPress,
    shirtHung,
    shirtFolded,
    shirtDryCleanAndPress,
    shirtWashAndPress,
    shirtPressOnly,
  } = req.body;
  User.findOne({ _id: _id }, (err, user) => {
    if (err || !user) {
      console.log('this is the error ', err);
      return res.status(400).json({
        error: 'User not found',
      });
    }
    user.name = name;
    user.profilePicture = profilePicture;
    user.phoneNumber = phoneNumber;
    user.address = address;
    user.preferences = preferences;
    user.beddingPressOnly = beddingPressOnly;
    user.beddingWashAndFold = beddingWashAndFold;
    user.beddingWashAndPress = beddingWashAndPress;
    user.shirtHung = shirtHung;
    user.shirtFolded = shirtFolded;
    user.shirtDryCleanAndPress = shirtDryCleanAndPress;
    user.shirtWashAndPress = shirtWashAndPress;
    user.shirtPressOnly = shirtPressOnly;

    user.save((err, updatedUser) => {
      if (err) {
        console.log('USER UPDATE ERROR', err);
        return res.status(400).json({
          error: 'User update failed',
        });
      }
      console.log('Updated user 🙂 - ', updatedUser);
      updatedUser.hashed_password = undefined;
      updatedUser.salt = undefined;
      res.json(updatedUser);
    });
  });
};

exports.updateOrders = (req, res) => {
  const { id } = req.params;
  const { pickupTime, pickup, dropOffTime, dropOff, address, requirements } =
    req.body;
  // find by document id and update and push item in array

  let email = '';
  let name = '';
  // find the user in db
  User.findById(id).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: 'User not found',
      });
    }
    console.log('fetching user for order update');
    email = user.email;
    name = user.name;
  });

  //send mail to spinwash for order
  const emailData = {
    from: 'spinwash8@gmail.com',
    to: 'spinwash8@gmail.com',
    subject: 'Order created',
    html: `
              <h1>New Order</h1>
              <p>${
                (email,
                name,
                pickupTime,
                pickup,
                dropOffTime,
                dropOff,
                address,
                requirements)
              }</p>
              <hr />
          `,
  };

  User.findByIdAndUpdate(
    id,
    { $push: { order: req.body } },
    { safe: true, upsert: true },
    (err, doc) => {
      if (err) {
        return res.status(400).json({ error: err });
      } else {
        console.log('new order created successfully');
        client.messages
          .create(process.env.MAIL_FROM, emailData)
          .then((sent) => {
            console.log('message sent successfully - ', sent);
            return res.json(doc.order);
          })
          .catch((err) => {
            console.log(err);
            return res.status(400).json({
              success: false,
            });
          });
      }
    }
  );
};
exports.getUserOrders = (req, res) => {
  const { _id } = req.params;

  User.findById(_id).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: 'User not found',
      });
    }
    console.log('fetching user orders');
    res.json(user.order);
  });
};
