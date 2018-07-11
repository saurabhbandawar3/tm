var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var User = Schema({
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
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        require: true,

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
            type: Boolean,
            required: true,
            default: false
        }
    }],
});

module.exports ={
    User
}