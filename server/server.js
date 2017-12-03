var express =  require('express');
var bodyParser = require('body-parser');
//body-parser is going to take our JSON and convert it into an object attaching it to the request object of the app
var {ObjectID} = require ('mongodb');

var mongoose = require('./db/mongoose.js')
var {Todo} = require('./models/todo.js');
var {User} = require('./models/user.js')


var app = express();

app.use(bodyParser.json()); // return value from this json() is a function and it is the middleware that we want to pass to express

app.post('/todos', (req, res) =>{
  var todo = new Todo({
    text: req.body.text
  });
  todo.save().then((doc)=>{
    res.send(doc);
  },(e)=>{
    res.status(400).send(e);
  });
});//app.post id used to post data to our server

app.get('/todos', (req, res)=>{
  Todo.find().then((todos)=>{
    res.send({todos});
  },(e)=>{
    res.status(400).send(e);
  });
});

app.get('/todos/:id',(req, res)=>{
  var id = req.params.id;

  if(!ObjectID.isValid(id)){
    return res.status(404).send();
  }
  Todo.findById(id).then((todo)=>{
    if(!todo){
      return res.status(404).send();
    }
    res.send({todo});

  }).catch((e)=>{
    res.status(400).send();
  });
});
/*
To pass a variable in the root link : /link/:var.
:var where var is the variable name.
and we can access this variable inside the req variable in the callback.
The variable is available inside req.params which is a key value objects.
*/

app.listen(3000,()=>{
  console.log('Started on port 3000');
})


module.exports = {app};
