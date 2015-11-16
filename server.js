var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;
var products = [{
	    id:1,
	    description : 'Unbreakble tempered glass bottle',
	    manufacturer : 'Pyrex'
	},
	{
	    id:2,
	    description: 'Stainless steel chef\'s pan',
	    manufacturer : 'All Clad'	
	}];


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

app.listen(PORT ,function(){
	console.log('Express listening on port '+ PORT + '!');
});