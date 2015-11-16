var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var PORT = process.env.PORT || 3000;
var products = [];
var productnextid = 1;


app.use(bodyParser.json());

app.get('/',function(req,res){
	res.send('Todo API Root');
});

app.get('/products',function(req,res){
	res.json(products);
});

app.get('/products/:id',function(req,res){
	//res.send('Asking for products with id of '+req.params.id);
	var prodid=req.params.id;
	//res.json('hi');
	var matchedprod;
	//Iterate over products array and find a match
	for(var i =0,len = products.length ;i < len ;i++){
		console.log(products[i].id + '   id '+prodid);
		if(products[i].id===parseInt(prodid,10)){
			matchedprod = products[i]; 	
		}
	}

	if(matchedprod){
		res.json(matchedprod);
	}
	else{
		res.status(404).send();
	}
});

app.post('/products',function(req,res){
	var body=req.body;

	//add id field 
	body.id = productnextid++;

	//push body into array
	products.push(body);

	console.log('description '+body.description);

	res.json(body);

});

app.listen(PORT ,function(){
	console.log('Express listening on port '+ PORT + '!');
});