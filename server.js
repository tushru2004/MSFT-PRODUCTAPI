var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db.js');

var app = express();
var PORT = process.env.PORT || 3000;
var products = [];
var productnextid = 1;


app.use(bodyParser.json());

app.get('/', function(req, res) {
	res.send('Product API ROOT');
});

app.get('/products', function(req, res) {
	var query = req.query;
	//var filteredprods = products;
	var where = {};

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

app.get('/products/:id', function(req, res) {
	//res.send('Asking for products with id of '+req.params.id);
	var prodid = parseInt(req.params.id, 10);
	

	db.Product.findById(prodid).then(function(product){

		if(!!product){
			res.json(product.toJSON());
		}else {
			res.status(404).send();
		}

	},function(e){
		res.status(500).send();
	});

});

app.post('/products', function(req, res) {
	var body = _.pick(req.body, 'name', 'description', 'manufacturer', 'isecofriendly');

	//call create on db.product
	db.Product.create(body).then(function(product){
		res.json(product.toJSON());
	},function(e){
		res.status(400).json(e);
	});

		//respond with 200 and product caller
		//res.json(e)

	/*if (!_.isString(body.description) || !_.isString(body.name) || _.isBoolean(body.isecofriendly) || !_.isString(body.manufacturer) || body.description.trim().length === 0 ||
		body.manufacturer.trim().length === 0 || body.name.trim().length === 0) {
		return res.status(400).send();
	}
	body.description = body.description.trim();
	//add id field 
	body.id = productnextid++;

	//push body into array
	products.push(body);

	res.json(body);
	*/

});

app.delete('/products/:id', function(req, res) {
	var prodid = parseInt(req.params.id, 10);

	var matchedprod = _.findWhere(products, {
		id: prodid
	});
	if (matchedprod) {
		products = _.without(products, matchedprod);
		res.json(products);
	} else {
		res.status(404).json({
			"error": "Product to be deleted not found"
		});
	}
});

app.put('/products/:id', function(req, res) {
	var prodid = parseInt(req.params.id, 10);
	var matchedprod = _.findWhere(products, {
		id: prodid
	});
	var body = _.pick(req.body, 'name', 'description', 'manufacturer');
	var validAtrributes = {};

	if (!matchedprod) {
		return res.status(404).send();
	}

	if (body.hasOwnProperty('name') && _.isString(body.name)) {
		validAtrributes.name = body.name;
	} else if (body.hasOwnProperty('name')) {
		return res.status(400).send();
	}

	if (body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0) {
		validAtrributes.description = body.description;
	} else if (body.hasOwnProperty('description')) {
		return res.status(400).send();
	}


	if (body.hasOwnProperty('manufacturer') && _.isString(body.manufacturer) && body.manufacturer.trim().length > 0) {
		validAtrributes.manufacturer = body.manufacturer;
	} else if (body.hasOwnProperty('manufacturer')) {
		return res.status(400).send();
	}

	_.extend(matchedprod, validAtrributes);
	res.json(matchedprod);
});


db.sequelize.sync().then(function(){

	app.listen(PORT, function() {
		console.log('Express listening on port ' + PORT + '!');
	});
});

