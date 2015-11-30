# MSFT-PRODUCTAPI
API for User and his favorite products

The api is live on heroku at http://msft-product-api.herokuapp.com
The code is at https://github.com/tushru2004/MSFT-PRODUCTAPI

1)	I have tested the code using postman. We can set the environment variable apiUrl to point to heroku deployment
 

2)	The user can be created by calling Post  /users. It can be reached  be http://msft-product-api.herokuapp.com/users 
 
3)	You can the user in at Post /users/login . This is at http://msft-product-api.herokuapp.com/users/login. 
     
It returns a token which has to passed on the next requests. You can save the token in heroku environment variables 
.
4)	Create a new product at POST /products. This is at http://msft-product-api.herokuapp.com/users/login/products
 

5)	Get products for a user at  http://msft-product-api.herokuapp.com/products. This request needs a header named Auth with the jwt token 


6)	Get products for a user by id  at  http://msft-product-api.herokuapp.com/products/1. This request needs a header named Auth with the jwt token
 


7)	Delete a product by id at http://msft-product-api.herokuapp.com/products/1 . This request needs a header named Auth with the jwt token 


8)	Logout user by deleting token. http://msft-product-api.herokuapp.com/users/login . This request needs a header named Auth with the jwt token
 
