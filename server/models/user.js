const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require ('jsonwebtoken');
const _ = require('lodash');

var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    unique: true, // verifies that the property email does not have the same value as any other document in the collection
    validate :{
      validator : (value)=>{
        return validator.isEmail(value);
      },
      message : '{VALUE} is not a valid email'
    }
  },
  password :{
    type: String,
    required: true,
    minlength: 6
  },
  tokens :[{
    access : {
      type: String,
      required: true
    },
    token:{
      type: String,
      required: true
    }
  }]
});

UserSchema.methods.toJSON = function () {
  var user = this;
  var userObject = user.toObject();
  /*toObject() is responsible for taking the mongoose variable
  and convert it into a regular object
  where only the properties available on the document exit*/
  return _.pick(userObject, ['_id', 'email']);
};
/*
toJSON() determine what exactly is going to be send back when a mongoose model is converted into a JSON value
*/

UserSchema.methods.generateAuthToken = function (){
  var user = this;
  var access = 'auth';
  var token =jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString();

  user.tokens.push({access, token});

  return user.save().then(()=>{
    return token;
  });
};

UserSchema.statics.findByToken = function (token){
  var User = this;
  var decoded;

  try{
    decoded = jwt.verify(token, 'abc123');
  }catch(e){
    // return new Promise((resolve, reject)=>{
    //   reject();
    // });
    //or use down below
    return Promise.reject();
  }

  return User.findOne({
    '_id' : decoded._id,
    'tokens.token': token,//this is a way to query a value in an object, because we use dot(.)
    'tokens.access': 'auth'
  });
};

var User = mongoose.model('User', UserSchema);

module.exports = {User};
