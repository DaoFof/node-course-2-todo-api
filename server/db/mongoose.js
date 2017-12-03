var mongoose =  require('mongoose');

mongoose.Promise = global.Promise;

const db_user= 'DaoFof';
const db_password = 'jetaimemaman1';
const db_link_from_mLab = `mongodb://<${db_user}>:<${db_password}>@ds127436.mlab.com:27436/todo-app-api`;

mongoose.connect(db_link_from_mLab || 'mongodb://localhost:27017/TodoApp');

module.exports = {mongoose};
