var express = require('express');
var bodyParser = require('body-parser');
var _=require('underscore');
var app = express();
var PORT = process.env.PORT || 3000;
var products = [];
var productnextid = 1;


app.use(bodyParser.json());

app.get('/',function(req,res){
	res.send('Product API ROOT');
});

app.get('/products',function(req,res){
	res.json(products);
});

app.get('/products/:id',function(req,res){
	//res.send('Asking for products with id of '+req.params.id);
	var prodid=parseInt(req.params.id,10);
	console.log(products);
	var matchedprod = _.findWhere(products,{id: prodid});
	console.log(matchedprod);
	if(matchedprod){
		res.json(matchedprod);
	}
	else{
		res.status(404).send();
	}
});

app.post('/products',function(req,res){
	var body = _.pick(req.body,'name','description','manufacturer');

	if(!_.isString(body.description) || !_.isString(body.name) || !_.isString(body.manufacturer) || body.description.trim().length ===0 ||
	body.manufacturer.trim().length ===0 || body.name.trim().length ===0 ){
		return res.status(400).send();
	}
	body.description = body.description.trim();
	//add id field 
	body.id = productnextid++;

	//push body into array
	products.push(body);

	console.log('description '+body.description);

	res.json(body);

});

app.delete('/products/:id',function(req,res){
	var prodid = parseInt(req.params.id,10);

	var matchedprod=_.findWhere(products, {id : prodid});
	console.log(matchedprod);
	if(matchedprod){
		products=_.without(products,matchedprod);
		res.json(products);
	}
	else{
		res.status(404).json({"error":"Product to be deleted not found"});
	}
});

app.listen(PORT ,function(){
	console.log('Express listening on port '+ PORT + '!');
});