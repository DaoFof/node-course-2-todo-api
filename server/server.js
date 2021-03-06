require('./config/config');

const _ =  require('lodash');
const express =  require('express');
const bodyParser = require('body-parser');
//body-parser is going to take our JSON and convert it into an object attaching it to the request object of the app
const {ObjectID} = require ('mongodb');

var mongoose = require('./db/mongoose.js')
var {Todo} = require('./models/todo.js');
var {User} = require('./models/user.js')
var {authenticate} = require('./middleware/authenticate');

var app = express();
const port = process.env.PORT;
app.use(bodyParser.json()); // return value from this json() is a function and it is the middleware that we want to pass to express



app.post('/todos',authenticate, (req, res) =>{
  var todo = new Todo({
    text: req.body.text,
    _creator: req.user._id
  });
  todo.save().then((doc)=>{
    res.send(doc);
  },(e)=>{
    res.status(400).send(e);
  });
});//app.post id used to post data to our server

app.get('/todos', authenticate, (req, res)=>{
  Todo.find({
    _creator: req.user._id// find only todos where the creator is the one log in
  }).then((todos)=>{
    res.send({todos});
  },(e)=>{
    res.status(400).send(e);
  });
});

app.get('/todos/:id',authenticate,(req, res)=>{
  var id = req.params.id;

  if(!ObjectID.isValid(id)){
    return res.status(404).send();
  }
  Todo.findOne({
    _id: id,
    _creator: req.user._id
  }).then((todo)=>{
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

app.delete('/todos/:id',authenticate, (req, res)=>{
  var id = req.params.id;
  if(!ObjectID.isValid(id)){
    return res.status(404).send();
  }
  Todo.findOneAndRemove({
    _id:id,
    _creator: req.user._id
  }).then((todo)=>{
    if(!todo){
      return res.status(404).send();
    }
    res.send({todo});
  }).catch((e)=>{
    res.status(400).send();
  });
});//delete is used to delete record inside of our collection


app.patch('/todos/:id',authenticate,  (req, res)=>{
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
  Todo.findOneAndUpdate({_id : id, _creator: req.user._id},{$set : body}, {new : true}).then((todo)=>{

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

// POST /users
app.post('/users',(req, res)=>{
  var body = _.pick(req.body, ['email', 'password']);
  var user =  new User(body);

  user.save().then(()=>{
    return user.generateAuthToken();
  }).then((token)=>{
      res.header('x-auth', token).send(user);/*
      res.header() lets us set a header so it's take the key:value
      */
  }).catch((e)=>{
    res.status(400).send(e);
  });
});

app.get('/users/me',authenticate/*so that we can use the req parameter*/, (req, res)=>{
  res.send(req.user);
});


app.post('/users/login',(req, res)=>{
  var body = _.pick(req.body, ['email', 'password']);

  User.findByCredentials(body.email, body.password).then((user)=>{
    return user.generateAuthToken().then((token)=>{
      res.header('x-auth', token).send(user);
    });
  }).catch((e)=>{
    res.status(400).send();
  });
});

app.delete('/users/me/token', authenticate,(req, res)=>{
  req.user.removeToken(req.token).then(()=>{
    res.status(200).send();
  },()=>{
    res.status(400).send();
  });
});

app.listen(port,()=>{
  console.log(`Started on port ${port}`);
});

module.exports = {app};
