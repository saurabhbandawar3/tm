var mongoose = require('mongoose');
var validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

var UserSchema = new mongoose.Schema({
    fname: {
        type: String,
        required: true,
        trim: true,
        minlength:1
    },
    lname: {
        type: String,
        required: true,
        trim: true,
        minlength: 1
    },
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        unique:true,
        validate: validator.isEmail,
            message: '{VALUE} is not a valid email'
    },
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 1,
    },
    password: {
        type: String,
        require: true,
        trim: true,
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
            type: Boolean,
            required: true,
            default: false
        }
    }],
});

UserSchema.methods.toJSON= function(    ){
    var user = this;
    var userObject = user.toObject();

    return _.pick(userObject, ['fname', 'lname', 'email',
    'username', 'hnumber', 'mnumber', 'designation', 'dob','tasks'
    ]);
}

UserSchema.methods.generateAuthToken = function () {
    var user = this;
    var access = 'auth';
    var token = jwt.sign({_id: user._id.toHexString(),access}, 'abc123').toString();
    user.tokens.push({access,token});
    return user.save().then(() => {
        return token;
    });
} 

UserSchema.statics.findByToken = function (token) {
        var User = this;
        var decoded;

        try {
            decoded = jwt.verify(token, 'abc123');
        } catch (e) {
            return Promise.reject();
        }

        return User.findOne({
            '_id': decoded._id,
            'tokens.token': token,
            'tokens.access': 'auth'
        });
}

UserSchema.pre('save', function (next) {
    var user = this;

    if (user.isModified('password')) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                next();
            });
        });
    } else {
        next();
    }
});
UserSchema.statics.findByCredentials = function (email, password) {
    var User = this;
    return User.findOne({email}).then((user) => {
        if (!user) {
            return Promise.reject();
        }
        return new Promise((resolve, reject) => {
            bcrypt.compare(password, user.password, (err, res) => {
                if (res) {
                    resolve(user);
                } else {
                    reject();
                }
            });
        });
    });
};
var User = mongoose.model('users', UserSchema);

UserSchema.methods.removeToken = function (token) {
    var user = this;
    return user.update({$pull: {tokens: {token}}
    });
};

module.exports ={
    User
}