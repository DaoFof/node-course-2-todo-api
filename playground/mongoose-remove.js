const {ObjectID} = require ('mongodb');

const {mongoose} =  require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

/* remove({}) help remove multiple records, we can pass an argument and it removes all the match items
it works like find(), the different is that we can't in empty argument and expect everything to be removed (remove()),
we want to remove everything remove we need to run remove({})
*/

// Todo.remove({}).then((result)=>{
//   console.log(result);
// });

/*
findOneAndRemove() remove to only first occurence of doc and remove it.
It also return the removed document
*/
/*
findByIdAndREmove() as the name find an Id and remove it.
It also going to return the removed document
*/

// Todo.findOneAndRemove({_id: '5a27edc8c05d6b1272945d92'}).then((todo)=>{
//
// });

Todo.findByIdAndRemove('5a27edc8c05d6b1272945d92').then((todo)=>{
  console.log(todo);
});
