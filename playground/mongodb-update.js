
// const MongoClient =  require('mongodb').MongoClient; // MongoClient lets us connect to a mongo server and issue commands to manipulate the database
const {MongoClient, ObjectID} =  require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp',(err, db) =>{
  if(err){
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');

  /* findOneAndUpdate : update an item and get the document back
  More : http://mongodb.github.io/node-mongodb-native/2.2/api/Collection.html#findOneAndUpdate
  */
  // db.collection('Todos').findOneAndUpdate({
  //   _id: new ObjectID('5a1a909b96c8768eca5838bc')
  // },{
  //   $set:{ //Sets the value of a field in a document.
  //     completed: true
  //   }
  // },{
  //   returnOriginal: false
  // }).then((result)=>{
  //   console.log(result);
  // });

  db.collection('Users').findOneAndUpdate({
    _id: new ObjectID('5a1875dee268037fce9ee5d6')
  },{
    $set:{
      name: 'Daouda'
    },
    $inc: {
      age: 1
    }
  }, {
    returnOriginal: false // When false, returns the updated document rather than the original. The default is true.
  }).then((result)=>{
    console.log(result);
  });
  //db.close();
});
