var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db.js');
var bcrypt= require('bcrypt');
var Promise = require("es6-promise").Promise;
var middleware  =require('./middleware.js')(db);

var app = express();
var PORT = process.env.PORT || 3000;
var products = [];
var productnextid = 1;


app.use(bodyParser.json());

app.get('/', function(req, res) {
	res.send('Product API ROOT');
});

app.get('/products',middleware.requireAuthentication ,function(req, res) {
	var query = req.query;
	//var filteredprods = products;
	var where = {
		userId: req.user.get('id')
	};

	if(query.hasOwnProperty('isecofriendly') && query.isecofriendly === 'true'){
		where.isecofriendly = true;
	} else if (query.hasOwnProperty('isecofriendly')&& query.isecofriendly === 'false'){
		where.isecofriendly = false;
	}

	if(query.hasOwnProperty('q') && query.q.length >0){
		where.description = {
			$like : '%' + query.q + '%'
		};
	}

	db.Product.findAll({where:where}).then(function (products){
		res.json(products);
	},function (e){
		res.status(500).send();
	});

});

app.get('/products/:id', middleware.requireAuthentication,function(req, res) {
	//res.send('Asking for products with id of '+req.params.id);
	var prodid = parseInt(req.params.id, 10);
		

	db.Product.findOne({
		where :{
			id:prodid,
			userId: req.user.get('id')
		}
	}).then(function(product){

		if(!!product){
			res.json(product.toJSON());
		}else {
			res.status(404).send();
		}

	},function(e){
		res.status(500).send();
	});

});

app.post('/products', middleware.requireAuthentication, function(req, res) {
	var body = _.pick(req.body, 'name', 'description', 'manufacturer', 'isecofriendly');

	//call create on db.product
	db.Product.create(body).then(function(product){
		
		req.user.addProduct(product).then(function (){
			return product.reload();
		}).then(function (product){
			res.json(product.toJSON());
		});

	},function(e){
		res.status(400).json(e);
	});
});

app.post('/users',function(req,res){
	var body = _.pick(req.body,'email','password');
	console.log(body);
	db.User.create(body).then(function(user){
		res.json(user.toPublicJSON());
	},function(e){
		console.log(e);
		res.status(400).json(e);
	});
});

//user/login
app.post('/users/login',function(req,res){
	var body = _.pick(req.body,'email','password');

	db.User.authenticate(body).then(function(user){
		
		var jtoken =user.generateToken('authentication');

	 	if(jtoken){
	 		res.header('Auth',jtoken).json(user.toPublicJSON());
	 	}else{
	 		res.status(401).send();
	 	}
		
	},function(err){
		res.status(401).send();
	});
	
});


app.delete('/products/:id',  middleware.requireAuthentication,function(req, res) {
	var prodid = parseInt(req.params.id, 10);

	db.Product.destroy({
		where :{
			id: prodid,
			userId : req.user.get('id')
		}
	}).then(function(rowdeletedcount){
		if(rowdeletedcount===0){
			res.status(404).json({error: "No product with id"});
		}
		else {
			res.status(204).send();
		}

	},function(){
		res.status(500).send();
	});

});

app.put('/products/:id', middleware.requireAuthentication, function(req, res) {
	var prodid = parseInt(req.params.id, 10);
	/*var matchedprod = _.findWhere(products, {
		id: prodid
	});*/
	var body = _.pick(req.body, 'name', 'description', 'manufacturer','isecofriendly');
	var atrributes = {};

	if (body.hasOwnProperty('name')) {
		atrributes.name = body.name;
	} 

	if (body.hasOwnProperty('description')) {
		atrributes.description = body.description;
	} 

	if (body.hasOwnProperty('manufacturer')) {
		atrributes.manufacturer = body.manufacturer;
	} 

	if(body.hasOwnProperty('isecofriendly')){
		atrributes.isecofriendly = body.isecofriendly;
	}
	db.Product.findOne({
		where :{
			id : prodid,
			userId : req.user.get('id')
		}
	}).then(function(product){
			if(product){
			 return	product.update(atrributes);
			}else{
				res.status(404).send();
			}
		},function (){
			res.status(500).send();
		}).then(function(product){
			res.json(product.toJSON());
		},function(err){
			res.status(400).json(err);
		});
});


db.sequelize.sync({force:true}).then(function(){

	app.listen(PORT, function() {
		console.log('Express listening on port ' + PORT + '!');
	});
});



function IS(type, obj){
	var clas = Object.prototype.toString.call(obj).slice(8,-1);
	return obj!== undefined && obj!== null && type === clas;	
}