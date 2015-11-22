var SequeLize = require('sequelize');
var sequelize = new SequeLize(undefined,undefined,undefined,{
	'dialect' : 'sqlite',
	'storage' : __dirname + '/data/dev-todoa-api.sqlite'
});

var db = {};

db.Product= sequelize.import(__dirname+'/models/product.js')

db.sequelize= sequelize;

db.SequeLize = SequeLize;

module.exports=db;