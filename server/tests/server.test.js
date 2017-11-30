const expect = require('expect');
const request = require('supertest');

const {app} =  require('./../server');
const {Todo} = require('./../models/todo');

beforeEach((done)=>{
  Todo.remove({}).then(()=>{
    done();
  });/*This is going to delete everything in the database*/
});
/*
beforeEach() is a test lifecycle, is going to let us run some code before any test case, means if we have two test case, the first it() is going to be executed and then the beforeEach() will be rerun and then run the 2nd it.
We are going to use it, to setup the database in a useful way. because below in the test suite,
we assume that there is nothing in the database so the test is going to fail without it.
We are going to make sure that the db is empty
*/

describe('POST /todos', ()=>{
  it('should create a new todo',(done)=>{
    var text = 'Test todo text';

    request(app)//request by supertest which allow to make a request on an app
      .post('/todos')// to make a post request
      .send({text}) // send for sending data, and data is an object which will be converted into JSON by supertest
      .expect(200)//expecting the status code to be 200
      .expect((res)=>{
        expect(res.body.text).toBe(text);
      })//now we are going to expect that the response coming from the request has a text object equal to the text object define above
      .end((err, res)=>{
        if(err){
          return done(err);//this is going to wrap up the test and print the err to the screen
        }

        Todo.find().then((todos)=>{
          expect(todos.length).toBe(1);// expecting that the collection has one element
          expect(todos[0].text).toBe(text);//expecting single element of collection equal to the text object defined above
          done();
        }).catch((e)=>done(e));// catch is going to catch any error in the callback function
      });// we should normally call end to wrap thing up but we are going to pass a function with err and res object to check if the data is saved into db
  });
  it('should not create todo with invalid body data', (done)=>{
    request(app)
      .post('/todos')
      .send({})
      .expect(400)
      .end((err, res)=>{
        if(err){
          return done(err);
        }

        Todo.find().then((todos)=>{
          expect(todos.length).toBe(0);
          done();
        }).catch((e) => done(e));
      });
  });
});
