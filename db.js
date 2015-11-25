var SequeLize = require('sequelize');
var env = process.env.NODE_ENV || 'development';
var sequelize;

if(env ==='production'){

	sequelize = new SequeLize(process.env.DATABASE_URL,{
		dialect : 'postgres'
	});
}
else {
    sequelize = new SequeLize(undefined,undefined,undefined,{
		'dialect' : 'sqlite',
		'storage' : __dirname + '/data/dev-todoa-api.sqlite'
	});
}
var db = {};

db.Product= sequelize.import(__dirname+'/models/product.js')

db.User = sequelize.import(__dirname+'/models/user.js');

db.sequelize= sequelize;

db.SequeLize = SequeLize;

module.exports=db;