var {User} = require('./../models/user');

var authenticate = (req, res, next) =>{
  var token = req.header('x-auth');/*
  req.header() is getting the value so we only pass the key
  */
  User.findByToken(token).then((user)=>{
    if(!user){
      return Promise.reject();// if executed it will go right to the catch block
    }

    req.user = user;
    req.token = token;
    next();//to be able to continue program execution where the function authenticate() is call
  }).catch((e)=>{
    res.status(401).send();
    //status(401) means authentication require
  });
};
/*
authenticate() is a middleware which will be doing authentication
*/

module.exports = {authenticate};
