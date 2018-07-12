const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
const _ = require('lodash');

var {
    mongoose
} = require('./db/mongoose');
var {
    User
} = require('./models/user')

const {
    MongoClient,
    ObjectID
} = require('mongodb');
var obj = new ObjectID();

app.use(cors());
app.use(bodyParser.json({
    extended: true
}));

app.post('/users', (req, res) => {
    var body = _.pick(req.body, ['fname', 'lname', 'email',
        'username', 'password', 'hnumber', 'mnumber', 'designation', 'dob'
    ]);
    console.log(body);
    var UsersModel = mongoose.model('users', User);
    var newuser = new UsersModel(body);
    newuser.save().then((doc) => {
        console.log(doc);
    }, (e) => {
        console.log('Unable to save user', e);
    });
});

app.post('/tasks', (req, res) => {
    var task = _.pick(req.body, ['ttitle', 'aName', 'aEmail', 'eName', 'eEmail',
        'deadline', 'tDetails'
    ]);
    console.log(task);
    var UsersM = mongoose.model('users', User);
    UsersM.findOneAndUpdate({
            email: req.body.eEmail
        }, {
            $set: {
                tasks: task
            }
        }, {
            returnOrignil: true
        })
        .then((result) => {
            console.log(result)
        });
});
app.get('/users', (req, res) => {
    var UsersM = mongoose.model('users', User);
    UsersM.find({}).then((usresData) => {
        console.log(usresData);
        res.send({
            usresData
        });
    }, (e) => {
        //console.log(e);
        res.status(400).send(e);
    });
});


app.post('/login', (req, res) => {
    const user = {
        username: req.body.username,
        password: req.body.password,
    };
    console.log(user);

});

app.listen(3000, () => {
    console.log('Server listening to port 3000');
});

module.exports = {
    app
}