const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

var UserSchema = new mongoose.Schema({
  fname: {
    type: String,
    required: true
  },
  lname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email'
    }
  },
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    require: true,
    minlength: 6
  },
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }],
  hnumber: {
    type: String,
    required: true
  },
  mnumber: {
    type: String,
    required: true
  },
  designation: {
    type: String,
    required: true
  },
  dob: {
    type: String,
    required: true
  },
  tasks: [{
    ttitle: {
      type: String,
      required: true
    },
    aName: {
      type: String,
      required: true
    },
    aemail: {
      type: String,
      required: true
    },
    eName: {
      type: String,
      required: true
    },
    eEmail: {
      type: String,
      required: true
    },
    deadline: {
      type: String,
      required: true
    },
    tDetails: {
      type: String,
      required: true
    },
    tstatus: {
      type: String,
      required: true
    }
  }],
});
var User = mongoose.model('User', UserSchema);

module.exports = {
  User
}