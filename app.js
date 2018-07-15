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

var {
    authenticate
} = require('./middleware/authenticate')

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
    var newuser = new User(body);
    newuser.save().then((user) => {
        return user.generateAuthToken();
    }).then((token)=>{
        res.header('x-auth',token).send(newuser);
    }).catch((e) => {
        console.log(e);
        res.status(400).send(e);
    });
});

app.post('/tasks', (req, res) => {
    var task = _.pick(req.body, ['ttitle', 'aName', 'aEmail', 'eName', 'eEmail',
        'deadline', 'tDetails'
    ]);
    console.log(task);
    User.findOneAndUpdate({
            email: req.body.eEmail
        }, {
            $push: {
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
    User.find({}).then((usresData) => {
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
    var body = _.pick(req.body, ['email', 'password']);
    console.log(body);
    User.findByCredentials(body.email, body.password).then((user) => {
        return user.generateAuthToken().then((token) => {
            res.header('x-auth', token).send(user);
        });
    }).catch((e) => {
        res.status(400).send();
    });
});


app.get('/users/me', authenticate, (req, res) => {
    console.log('res:',req.user);
   res.send(req.user);

});

app.listen(3000, () => {
    console.log('Server listening to port 3000');
});

module.exports = {
    app
}