require('./config/config');

const _ =  require('lodash');
const express =  require('express');
const bodyParser = require('body-parser');
//body-parser is going to take our JSON and convert it into an object attaching it to the request object of the app
const {ObjectID} = require ('mongodb');

var mongoose = require('./db/mongoose.js')
var {Todo} = require('./models/todo.js');
var {User} = require('./models/user.js')


var app = express();
const port = process.env.PORT;
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

app.delete('/todos/:id',(req, res)=>{
  var id = req.params.id;
  if(!ObjectID.isValid(id)){
    return res.status(404).send();
  }
  Todo.findByIdAndRemove(id).then((todo)=>{
    if(!todo){
      return res.status(404).send();
    }
    res.send({todo});
  }).catch((e)=>{
    res.status(400).send();
  });
});//delete is used to delete record inside of our collection


app.patch('/todos/:id', (req, res)=>{
  var id = req.params.id;
  var body = _.pick(req.body, ['text', 'completed']);
  /*_.pick() Creates an object composed of the picked object properties.
  var object = { 'a': 1, 'b': '2', 'c': 3 };
  _.pick(object, ['a', 'c']);
  // => { 'a': 1, 'c': 3 }
  */
  if(!ObjectID.isValid(id)){
    return res.status(404).send();
  }

  if(_.isBoolean(body.completed) && body.completed){
    body.completedAt = new Date().getTime();
  }else{
    body.completed = false;
    body.completedAt = null; // to remove from database
  }
  Todo.findByIdAndUpdate(id,{$set : body}, {new : true}).then((todo)=>{

    if(!todo){
      return res.status(404).send();
    }

    res.send({todo});
  }).catch((e)=>{
    res.status(400).send();
  });

});

/*
HTTP PATCH method is what we use when we are going to update a resource
*/

app.post('/users',(req, res)=>{
  var body = _.pick(req.body, ['email', 'password']);
  var user =  new User(body);

  user.save().then(()=>{
    return user.generateAuthToken();
  }).then((token)=>{
      res.header('x-auth', token).send(user);
  }).catch((e)=>{
    res.status(400).send(e);
  });
});

app.listen(port,()=>{
  console.log(`Started on port ${port}`);
});

module.exports = {app};
