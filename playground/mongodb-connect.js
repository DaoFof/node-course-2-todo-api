/*
mongodb is the driver used by node to connect to mongodb database
The terms are differents in SQL and NO SQL db
  database = database
  table = collection
  row = document
  column = field
  And in MongoDB we don't need to create a database or a collection before adding data to it, it will be create automatically
  Object destructuring let us pull out properties from an object creating variables
    Ex: var user = {name: 'Daouda'};
    var {name} = user; (name = 'Daouda')

*/

// const MongoClient =  require('mongodb').MongoClient; // MongoClient lets us connect to a mongo server and issue commands to manipulate the database
const {MongoClient, ObjectID} =  require('mongodb');
//ObjectID lets us make new object ID even if we are not storing data

MongoClient.connect('mongodb://localhost:27017/TodoApp',(err, db) =>{
  if(err){
    return console.log('Unable to connect to MongoDB server');
  }//we put the return statement so that if this this if block executed it prevents the remain code to execute
  console.log('Connected to MongoDB server');

  // db.collection('Todos').insertOne({
  //   text: 'Something to do',
  //   completed: false
  // },(err, result) =>{
  //   if(err){
  //     return console.log('Unable to insert todo', err);
  //   }
  //   console.log(JSON.stringify(result.ops, undefined, 2));
  // });
  /*db.collection() takes one arguments which the collection we want to make operation on, ex: db.collection('Todos')
  insertOne() let us insert a new document in our collection and it takes 2 arguments:
  1- the object to insert which store the various key value pairs
  2- the callback function which fired when things either go well or fail, and it takes 2 arguments:
    1- error object (err) : It may or not exist
    2- result : which is going to be provided if things went well,
    result.ops is going to store all the documents that were inserted
  */

  // db.collection('Users').insertOne({
  //   name: 'Daouda',
  //   age:20,
  //   location: 'India'
  // },(err, result)=>{
  //   if(err){
  //     return console.log('Unable to insert user', err);
  //   }
  //   console.log(JSON.stringify(result.ops[0]._id.getTimestamp()));
  //   /*
  //   _id: getTimestamp(): We can get the time from where it has been created through this method,
  //     which does take any parameter
  //   */
  // });
  db.close();// this close the connection with the MongoDB server
});
/*
connect() takes 2 argument:
1- The url where the db lives, for a deployment it may be a Amazon web Service URL or a Heroku URl,
but in local it'll be our localhost url
Ex: mongodb://localhost:27017/TodoApp
  mongodb:// is the protocol of the database
  localhost:27017/ is the URL
  TodoApp is the database name
2- The callback function that is going to be fired after the connection has either succeeded or failed.
And it takes 2 arguments:
  1- err : this might exist if there an error or not exist in case of no error
  2- db: this is what we can use to issue command to read and write data
*/
