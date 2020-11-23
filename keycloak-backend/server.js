const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const todoRoutes = express.Router();
const keycloak = require('./keycloak-config.js').initKeycloak();
const PORT = 4000;

let Todo = require('./todo.model');

app.use(cors({ origin: true }));
app.use(bodyParser.json());


app.use(keycloak.middleware());

const {
    MONGO_HOSTNAME,
    MONGO_DB,
    MONGO_PORT
} = process.env;

mongoose.connect(`mongodb://${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}`, { useNewUrlParser: true });
const connection = mongoose.connection;

connection.once('open', function() {
    console.log("MongoDB database connection established successfully");
})

todoRoutes.route('/').get(keycloak.protect(['user', 'admin']), function(req, res) {
    Todo.find(function(err, todos) {
        if (err) {
            console.log(err);
        } else {
            res.json(todos);
        }
    });
});

todoRoutes.route('/:id').get(keycloak.protect(['user', 'admin']), function(req, res) {
    let id = req.params.id;
    Todo.findById(id, function(err, todo) {
        res.json(todo);
    });
});

todoRoutes.route('/add').post(keycloak.protect('admin'), function(req, res) {
    let todo = new Todo(req.body);
    todo.save()
        .then(todo => {
            res.status(200).json({'todo': 'todo added successfully'});
        })
        .catch(err => {
            res.status(400).send('adding new todo failed');
        });
});

todoRoutes.route('/update/:id').post(keycloak.protect(['user', 'admin']), function(req, res) {
    Todo.findById(req.params.id, function(err, todo) {
        if (!todo)
            res.status(404).send('data is not found');
        else
            todo.todo_description = req.body.todo_description;
            todo.todo_responsible = req.body.todo_responsible;
            todo.todo_priority = req.body.todo_priority;
            todo.todo_completed = req.body.todo_completed;

            todo.save().then(todo => {
                res.json('Todo updated');
            })
            .catch(err => {
                res.status(400).send("Update not possible");
            });
    });
});

app.use('/todos', todoRoutes);

app.listen(PORT, function() {
    console.log("Server is running on Port: " + PORT);
});