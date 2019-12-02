const express = require('express')
const db = require('../db/db')
const bodyParser = require('body-parser')
// Set up the express app
const app = express();

// Parse incoming requests data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


// test
app.get('/api/v1/hello', (req, res) => {
  res.status(200).send({
    success: true,
    message: 'hello'
  })
})

// get all todos
app.get('/api/v1/todos', (req, res) => {
  res.status(200).send({
    success: true,
    message: 'todos retrieved successfully',
    todos: db
  })
});

app.post('/api/v1/todos', (req, res) => {
  if(!req.body.title) {
    res.status(400).send({
      success: false,
      message: 'title is required'
    });
  } else if(!req.body.description) {
    res.status(400).send({
      success: false,
      message: 'description is required'
    });
  }
  const todo = {
    id: db[db.length - 1].id + 1,
    title: req.body.title,
    description: req.body.description
  }
  db.push(todo);
  res.status(201).send({
    success: true,
    message: 'todo added successfully',
    todo
  })
});

app.get('/api/v1/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  db.find((todo) => {
    if (todo.id === id) {
      return res.status(200).send({
        success: true,
        message: 'todo retrieved successfully',
        todo,
      });
    }
  })
  return res.status(404).send({
    success: false,
    message: 'todo does not exist',
  });
});

app.delete('/api/v1/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  // res.set('Content-Type', 'application/json');

  db.map((todo, index) => {
    if (todo.id === id) {
      db.splice(index, 1);

      return res.status(200).send({
        success: true,
        message: 'todo retrieved successfully',
        todo,
      });
    }
  })
  return res.status(404).send({
    success: false,
    message: 'todo not found',
  });

});


app.put('/api/v1/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  let todoFound;
  let itemIndex;
  db.find((todo, index) => {
    if (todo.id === id) {
      todoFound = todo;
      itemIndex = index;
    }
  });

  if (!todoFound) {
    return res.status(404).send({
      success: false,
      message: 'todo not found',
    });
  }

  if (!req.body.title) {
    return res.status(400).send({
      success: false,
      message: 'title is required',
    });
  } else if (!req.body.description) {
    return res.status(400).send({
      success: false,
      message: 'description is required',
    });
  }

  const updatedTodo = {
    id: todoFound.id,
    title: req.body.title || todoFound.title,
    description: req.body.description || todoFound.description,
  };

  db.splice(itemIndex, 1, updatedTodo);

  return res.status(201).send({
    success: true,
    message: 'todo added successfully',
    updatedTodo,
  });
});


const PORT = 5000;

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`)
});