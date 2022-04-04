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
    shirtFoldingPreference,
    shirtWashingPreference,
    beddingPreference,
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
    user.shirtFoldingPreference = shirtFoldingPreference;
    user.shirtWashingPreference = shirtWashingPreference;
    user.beddingPreference = beddingPreference;
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
  console.log(pickupTime, pickup, dropOffTime, dropOff, address, requirements);

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
    console.log(email);
    name = user.name;

    console.log('email - ', email);

    //send mail to spinwash for order
    const emailData = {
      from: 'Spinwash <info@spinwash.co.uk>',
      to: 'spinwash8@gmail.com',
      subject: 'Order created',
      html: `
              <h1>New Order</h1>
              <p>
              <b>Email</b> - ${email},
              <br/>
               <b>Name</b> - ${name},
                <br/>
               <b>Pickup</b> - ${pickup} - ${pickupTime},
                <br/>
               <b>DropOff</b> - ${dropOff} - ${dropOffTime},
                <br/>
               <b>Address</b> - ${address},
                <br/>
               <b>Requirements</b> - ${requirements}
                <br/>
              </p>
              <hr />
          `,
    };
    const emailDataClient = {
      from: 'Spinwash <info@spinwash.co.uk>',
      to: email,
      subject: 'Order Confirmed',
      html: `
              <h1>Details about your Order</h1>
              <p>
                <br/>
                <b>Pickup</b> - ${pickup} - ${pickupTime},
                <br/>
                <b>DropOff</b> - ${dropOff} - ${dropOffTime},
                <br/>
                <b>Address</b> - ${address},
                <br/>
                <b>Requirements</b> - ${requirements}
                 <br/>
              </p>
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
              console.log('message sent successfully to spinwash', sent);
            })
            .catch((err) => {
              console.log('message not sent to spinwash', err);
            });

          client.messages
            .create(process.env.MAIL_FROM, emailDataClient)
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
  });
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

exports.contactController = (req, res) => {
  const { name, email, message } = req.body;
  const emailData = {
    from: email,
    to: 'spinwash8@gmail.com',
    subject: 'New Message',
    html: `
              <h1>New Order</h1>
              <p>
              Email - ${email},
              <br/>
              Name - ${name},
              <br/>
              Message - ${message}
              <br/>
              </p>
              <hr />
          `,
  };
  client.messages
    .create(process.env.MAIL_FROM, emailData)
    .then((sent) => {
      return res.json({
        message: `Message sent successfully`,
      });
    })
    .catch((err) => {
      return res.status(400).json({
        success: false,
        errors: 'Message not sent',
      });
    });
};
