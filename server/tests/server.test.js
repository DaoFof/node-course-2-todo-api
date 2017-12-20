const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require ('mongodb');

const {app} =  require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);
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

        Todo.find({text}).then((todos)=>{
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
          expect(todos.length).toBe(2);
          done();
        }).catch((e) => done(e));
      });
  });
});

describe('GET /todos', ()=>{
  it('should get all todos', (done)=>{
    request(app)
      .get('/todos')
      .expect(200)
      .expect((res) =>{
        expect(res.body.todos.length).toBe(2)
      })
      .end(done);
  });
});

describe('GET /todos/:id', ()=>{
  it('should return todo doc',(done)=>{
    // console.log(`${todos[0]._id.toHexString()}`);
    // console.log(typeof(todos[0]._id.toHexString()));
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .expect(200)
      .expect((res)=>{
        expect(res.body.todo.text).toBe(todos[0].text);
      })
      .end(done);
  });
  it('should return a 404 if todo not found',(done)=>{
    var hexId = new ObjectID().toHexString();
    request(app)
      .get(`/todos/${hexId}`)
      .expect(404)
      .end(done);
  });
  it('should return 404 for non-object ids',(done)=>{
    request(app)
      .get('/todos/123')
      .expect(404)
      .end(done);
  });
});

describe('DELETE /todos/:id ', ()=>{
  it('should delete a todo', (done)=>{
    var hexId = todos[1]._id.toHexString();
    request(app)
      .delete(`/todos/${hexId}`)
      .expect(200)
      .expect((res)=>{
        expect(res.body.todo._id).toBe(hexId);
      }).end((err, res)=>{
        if(err){
          return done(err);
        }
        Todo.findById(hexId).then((todo)=>{
          expect(todo).toNotExist();
          done();
        }).catch((e)=>done());
      });
  });
  it('should return a 404 id todo not found', (done)=>{
    var hexId = new ObjectID().toHexString();
    request(app)
      .delete(`/todos/${hexId}`)
      .expect(404)
      .end(done);
  });
  it('should return 404 if ObjectID is invalid', (done)=>{
    request(app)
      .delete('/todos/123')
      .expect(404)
      .end(done);
  });
});

describe('PATCH /todos/:id', ()=>{
  it('should update the todo', (done)=>{
    var hexId = todos[0]._id.toHexString();
    var text = 'This should be the new text';

    request(app)
      .patch(`/todos/${hexId}`)
      .send({
        text,
        completed: true
      })
      .expect(200)
      .expect((res)=>{
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBe(true);
        expect(res.body.todo.completedAt).toBeA('number');
      })
      .end(done);
  });

  it('should clear completedAt when todo is not completed', (done)=>{
    var hexId = todos[1]._id.toHexString();
    var text = 'This should be the new text!!';

    request(app)
      .patch(`/todos/${hexId}`)
      .send({
        text,
        completed: false
      })
      .expect(200)
      .expect((res)=>{
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBe(false);
        expect(res.body.todo.completedAt).toNotExist();
      })
      .end(done);
  });
});

describe('GET /users/me', ()=>{
  it('should return user if authenticated', (done)=>{
    request(app)
      .get('/users/me')
      .set('x-auth', users[0].tokens[0].token)//set() is used to set header in using supertest
      .expect(200)
      .expect((res)=>{
        expect(res.body._id).toBe(users[0]._id.toHexString());
        expect(res.body.email).toBe(users[0].email);
      })
      .end(done);
  });
  it('should return a 401 if not authenticated', (done)=>{
    request(app)
      .get('/users/me')
      .expect(401)
      .expect((res)=>{
        expect(res.body).toEqual({});
      })
      .end(done);
  });
});

describe('POST /users', ()=>{
  it('should create a user', (done)=>{
    var email = 'example@ddd.fr';
    var password = '123aaa';

    request(app)
      .post('/users')
      .send({email, password})
      .expect(200)
      .expect((res)=>{
        expect(res.headers['x-auth']).toExist();
        expect(res.body._id).toExist();
        expect(res.body.email).toBe(email);
      })
      .end((err)=>{
        if(err){
          return done(err);
        }
        User.findOne({email}).then((user)=>{
          expect(user).toExist();
          expect(user.password).toNotBe(password);
          done();
        }).catch((e)=> done(e));
      });
  });

  it('should return validation errors if request invalid',(done)=>{
    var email = 'dao.fr';
    var password= 'aaa';

    request(app)
      .post('/users')
      .send({email, password})
      .expect(400)
      .end(done);
  });

  it('should not create user if email in use', (done)=>{

    request(app)
      .post('/users')
      .send({
        email: users[0].email,
        password: 'password123'
      })
      .expect(400)
      .end(done);
  });
})

describe('POST /users/login',()=>{
  it('should login user and return auth token',(done)=>{
    request(app)
      .post('/users/login')
      .send({
        email: users[1].email,
        password: users[1].password
      })
      .expect(200)
      .expect((res)=>{
        expect(res.headers['x-auth']).toExist();
      })
      .end((err,res)=>{
        if(err){
          return done(err);
        }

        User.findById(users[1]._id).then((user)=>{
          expect(user.tokens[0]).toInclude({
            access: 'auth',
            token: res.headers['x-auth']
          });
          done();
        }).catch((e)=> done(e));
      });
  });

  it('should reject invalid login', (done)=>{
    request(app)
      .post('/users/login')
      .send({
        email: users[1].email,
        password: users[1].password + '1'
      })
      .expect(400)
      .expect((res)=>{
        expect(res.headers['x-auth']).toNotExist();
      })
      .end((err,res)=>{
        if(err){
          return done(err);
        }

        User.findById(users[1]._id).then((user)=>{
          expect(user.tokens.length).toBe(0);
          done();
        }).catch((e)=> done(e));
      });
  });
});
