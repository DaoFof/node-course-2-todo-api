const {ObjectId} = require ('mongodb');

const {mongoose} =  require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

//var id = '5a22f2d84522260c21f7087011';

// if(!ObjectId.isValid(id)){
//   console.log('ID not valid');
// }
//isValid() lets us verified the validity of an id, return true if valid

// Todo.find({
//   _id : id //mongoose lets us pass string id instead of Object ID variable
// }).then((todos)=>{
//   console.log('Todos', todos);
// });
/* find() is a mongoose built-in function which help fetching everything or querying by anything
If the id is not found the then will get executed and it will return an empty array
*/

// Todo.findOne({
//   _id : id
// }).then((todo)=>{
//   console.log('Todo', todo);
// });
/*findOne() return the first occurence find in the collection
If the id is not found the then will get executed and it will return a null object
*/

// Todo.findById(id).then((todo)=>{
//   if(!todo){
//     return console.log('Id not found');
//   }
//   console.log('Todo by id', todo);
// }).catch((e)=>console.log(e));
/* findById() lets us get the concern id that we search for by passing the id variable
If the id is not found the then will get executed and it will return a null object
*/

User.findById('5a1ce191366fdebb4b6ffc7e').then((user)=>{
  if(!user){
    return console.log('Unable to find user');
  }
  console.log(JSON.stringify(user, undefined, 2));
}).catch((e) => {
  console.log(e);
});
