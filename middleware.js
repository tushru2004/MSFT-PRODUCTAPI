var cryptojs = require('crypto-js');

module.exports = function(db) {

	return {
		requireAuthentication: function(req, res, next) {
			var token = req.get('Auth') || '';
			console.log(' getting Md 5 value is ' + cryptojs.MD5(token).toString());

			db.token.findOne({
				where: {
					tokenHash: cryptojs.MD5(token).toString()
				}
			}).then(function(tokenInst) {
				if (!tokenInst) {
					throw new Error();
				}
				//console.log(tokenInst);
				req.token = tokenInst;
				return db.User.findByToken(token);
			}).then(function(user) {
				req.user = user;
				next();
			}).catch(function(err) {
				//console.log(err);
				res.status(401).send();

			});
		}
	};
};