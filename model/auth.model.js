const mongoose = require('mongoose');
const crypto = require('crypto');
// user schema
const userScheama = new mongoose.Schema(
  {
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      lowercase: true,
    },
    referralCodeUsed: {
      type: Boolean,
      default: false,
    },
    name: {
      type: String,
      trim: true,
      required: true,
    },
    phoneNumber: {
      type: String,
    },
    address: {
      type: String,
    },
    postcode: {
      type: Number,
    },
    order: [
      {
        pickupTime: String,
        pickup: String,
        dropOffTime: String,
        dropOff: String,
        address: String,
        requirements: String,
      },
    ],
    profilePicture: {
      type: String,
      default:
        'https://www.ommel.fi/content/uploads/2019/03/dummy-profile-image-male.jpg',
    },
    hashed_password: {
      type: String,
      required: true,
    },
    shirtFoldingPreference: { type: String, default: 'Hung' },
    shirtWashingPreference: { type: String, default: 'Wash And Press' },
    beddingPreference: { type: String, default: 'Wash And Press' },
    preferences: { type: String },
    salt: String,
    role: {
      type: String,
      default: 'subscriber',
    },
    resetPasswordLink: {
      data: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// virtual
userScheama
  .virtual('password')
  .set(function (password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashed_password = this.encryptPassword(password);
  })
  .get(function () {
    return this._password;
  });

// methods
userScheama.methods = {
  authenticate: function (plainText) {
    return this.encryptPassword(plainText) === this.hashed_password;
  },

  encryptPassword: function (password) {
    if (!password) return '';
    try {
      return crypto
        .createHmac('sha1', this.salt)
        .update(password)
        .digest('hex');
    } catch (err) {
      return '';
    }
  },

  makeSalt: function () {
    return Math.round(new Date().valueOf() * Math.random()) + '';
  },
};

module.exports = mongoose.model('User', userScheama);
