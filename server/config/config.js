var env = process.env.NODE_ENV || 'development';


if(env === 'development' || env ==='test'){
  var config = require('./config.json');
  /*
  When we requre json it parse automatically into javascript object
  */
  var envConfig = config[env];// when we want to use variable to access a property we have to use bracket

  Object.keys(envConfig).forEach((key)=>{
    process.env[key] = envConfig[key];
  });
  /*
  Object.keys(item) return an array of key of the item object
  */
}
