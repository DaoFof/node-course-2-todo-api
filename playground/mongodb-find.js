
// const MongoClient =  require('mongodb').MongoClient; // MongoClient lets us connect to a mongo server and issue commands to manipulate the database
const {MongoClient, ObjectID} =  require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp',(err, db) =>{
  if(err){
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');

  // db.collection('Todos').find({
  //   _id: new ObjectID('5a19ceed96c8768eca582512')
  // }).toArray().then((docs) =>{
  //   //docs parameter has the array of documents
  //   console.log('Todos');
  //   console.log(JSON.stringify(docs, undefined, 2));
  // },(err) =>{
  //   console.log('Unable to fetch Todos', err);
  // });
  // db.collection('Todos').find().count().then((count) =>{
  //   console.log(`Todos count: ${count}`);
  // },(err) =>{
  //   console.log('Unable to fetch Todos', err);
  // });
  db.collection('Users').find({name: 'Daouda'}).toArray().then((docs) => {
    console.log('Users');
    console.log(JSON.stringify(docs, undefined, 2));
  },(err) =>{
    console.log('Unable to fetch Users', err);
  });
  /*
  find(): by default takes no arguments and that means that we want to fetch everything or we can pass
  query parameter means we can pass inside object of value that we want to select
  Ex: find({completed: false})
  And in other to query by _id we have to use ObjectID constructor
  Ex:find({
    _id: new ObjectID('5a1874d1dcebdb7f67630551')
  })
  And find return a cursor, this cursor is not the actual  documents themselves
  And this cursor has a lot of methods, we can use those methods to get our documents.
  Ex: toArray() : instead of having a cursor, we have an array of documents.
    And toArray() returns a promise, so we can call then() when thing went well
  */
  //db.close();
});
