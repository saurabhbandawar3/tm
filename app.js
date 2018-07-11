const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
const _ = require('lodash');


// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');
var obj = new ObjectID();

const {User} = require('./user');

app.use(cors());
app.use(bodyParser.json({extended: true}));

app.post('/tasks', (req, res) => {
    var task = _.pick(req.body, ['ttitle','aName','aEmail','eName','eEmail',
            'deadline','tDetails']);
    console.log(task);
    MongoClient.connect('mongodb://localhost:27017/taskdb',{useNewUrlParser: true}, (err, client) => {
        if (err) {
            return console.log('Unable to connect to MongoDB server');
        }
        const db = client.db('taskdb');
        db.collection('Tasks').insert(task, (err, result) => {
            if (err) {
                res.send({'error': 'Unable to insert task'});
            }
            console.log(JSON.stringify(result.ops[0]._id    , undefined, 2));
            res.send(result.ops[0]._id);
        });
    });
});

app.post('/users', (req, res) => {
    var body = _.pick(req.body, ['fname', 'lname', 'email',
                    'username','password','hnumber','mnumber','designation','dob']);
    console.log(body);  
    MongoClient.connect('mongodb://localhost:27017/taskdb', {useNewUrlParser: true}, (err, client) => {
        if (err) {
            return console.log('Unable to connect to MongoDB server');
        }
        const db = client.db('taskdb');
        db.collection('Users').insertOne(body, (err, result) => {
            if (err) {
                res.send({'error': 'Unable to insert user'});
            }
            console.log(result.ops[0]._id.getTimestamp());
            res.send(result.ops[0]);
        });
        
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

MongoClient.connect('mongodb://localhost:27017/taskdb', {
    useNewUrlParser: true
}, (err, client, ) => {
    if (err) {
        return console.log('Unable to connect to MongoDB server');
    }
    const db = client.db('taskdb');
    db.collection('tasks').find().toArray().then((data) => {
        console.log(JSON.stringify(data, undefined, 2));
    }, (err) => {
        console.log('Unable to fetch the records', err);
    });
});
