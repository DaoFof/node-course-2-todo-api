var mongoose = require('mongoose');

var Todo = mongoose.model('Todo', {
  text:{
    type: String,
    required : true,
    minLength: 1,
    trim: true, // Essentially trim, wipp off any white space at the beginning or end of a value
  },
  completed:{
    type: Boolean,
    default: false
  },
  completedAt:{
    type: Number,
    default: null
  },
  _creator:{
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
});

module.exports = {Todo};
/*model() is used to create a new model base on the schema pass in 2nd argument
*/

// var newTodo = new Todo({
//   text: 'Cook dinner'
// });/* While creating an instance, we can add value to some of the field in the schema(2nd argument).*/


// newTodo.save().then((doc)=>{
//   console.log('Saved todo' , doc);
// },(e)=>{
//   console.log('Unable to save todo');
// }); // save() is used to save to instance of model to database and return a promise
