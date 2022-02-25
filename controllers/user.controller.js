const User = require('../model/auth.model');

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
    shirtFolded,
    shirtHung,
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
    user.shirtFolded = shirtFolded;
    user.shirtHung = shirtHung;

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
  User.findByIdAndUpdate(
    id,
    { $push: { order: req.body } },
    { safe: true, upsert: true },
    (err, doc) => {
      if (err) {
        return res.status(400).json({ error: err });
      } else {
        console.log('new order created successfully');
        return res.json(doc.order);
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
