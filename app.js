const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
const _ = require('lodash');


var {mongoose} = require('./db/mongoose');
var {User} = require('./models/user')

var {authenticate} = require('./middleware/authenticate')

app.use(cors());
app.use(bodyParser.json({extended: true}));

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

app.post('/users/tasks', (req, res) => {
    var task = _.pick(req.body, ['ttitle', 'aName', 'aEmail', 'eName', 'eEmail',
        'deadline', 'tDetails'
    ]);
    console.log(task);
    User.findOneAndUpdate({email: req.body.eEmail}, {$push: {tasks: task}}, {
            returnOrignil: true
        })
        .then((result) => {
            console.log(result);
            res.send(result);
        });
});

app.get('/users', (req, res) => {
    User.find({}).then((usresData) => {
        res.send({usresData});
    }, (e) => {
        //console.log(e);
        res.status(400).send(e);
    });
});

app.post('/users/login', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);
    console.log(body);
    User.findByCredentials(body.email, body.password).then((user) => {
        return user.generateAuthToken().then((token) => {
            console.log(token);
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

app.delete('/users/me/token', authenticate, (req, res) => {
    req.user.removeToken(req.token).then(() => {
        res.status(200).send();
    }, () => {
        res.status(400).send();
    });
});

app.listen(3000, () => {
    console.log('Server listening to port 3000');
});

module.exports = {
    app
}