var express =  require('express');
var bodyParser = require('body-parser');
//body-parser is going to take our JSON and convert it into an object attaching it to the request object of the app

var mongoose = require('./db/mongoose.js')
var {Todo} = require('./models/todos.js');
var {User} = require('./models/users.js')


var app = express();

app.use(bodyParser.json()); // return value from this json() is a function and it is the middleware that we want to pass to express

// app.post('/todos',(req, res)=>{
//   var todo = new Todo({
//     text: req.body.text
//   });
//   todo.save().then((doc)=>{
//     res.send(doc);
//   },(e)=>{
//     res.status(400).send(e);
//   });
// });//app.post id used to post data to our server

app.post('/todos', (req, res) =>{
  var todo = new Todo({
    text: req.body.text
  });
  todo.save().then((doc)=>{
    res.send(doc);
  },(e)=>{
    res.status(400).send(e);
  });
});
app.listen(3000,()=>{
  console.log('Started on port 3000');
})
