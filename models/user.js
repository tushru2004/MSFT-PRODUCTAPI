var bcrypt = require('bcrypt');
var _ = require('underscore');
var cryptojs = require('crypto-js');
var jwt = require('jsonwebtoken');

module.exports = function(sequelize, DataTypes) {

	var user = sequelize.define('user', {
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
			validate: {
				isEmail: true
			}
		},
		salt: {
			type: DataTypes.STRING
		},
		password_hash: {
			type: DataTypes.STRING
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				len: [7, 100]
			},
			set: function(value) {
				var salt = bcrypt.genSaltSync(10);
				var hashedPassword = bcrypt.hashSync(value, salt);

				this.setDataValue('password', value);
				this.setDataValue('salt', salt);
				this.setDataValue('password_hash', hashedPassword);
			}
		}
	}, {
		hooks: {
			beforeValidate: function(user, options) {

				if (IS('String', user.email)) {
					user.email = user.email.toLowerCase();
				}
			}
		},
		instanceMethods: {
			toPublicJSON: function() {
				var json = this.toJSON();
				return _.pick(json, 'id', 'email', 'createdAt', 'updatedAt');
			},
			generateToken: function(type) {
				if (!_.isString(type)) {
					if (!_.isString(type)) {
						return undefined;
					}
				}

				try {
					var stringData = JSON.stringify({
						id: this.get('id'),
						type: type
					});
					var encryptedData = cryptojs.AES.encrypt(stringData, 'abc1231@#!').toString();
					var token = jwt.sign({
						token: encryptedData
					}, 'hhh420');

					return token;
				} catch (e) {
					console.error(e);
					return undefined;
				}
			}
		},
		classMethods: {
			authenticate: function(body) {
				return new Promise(function(resolve, reject) {

					if (!IS('String', body.email) || !IS('String', body.password)) {
						return reject();
					}

					user.findOne({
						where: {
							email: body.email
						}
					}).then(function(user) {
						if (!user || !bcrypt.compareSync(body.password, user.get('password_hash'))) {
							return reject();
						}
						resolve(user);

					}, function(err) {
						reject();
					});

				});
			},

			findByToken: function(token) {
				return new Promise(function(resolve, reject) {
					try {
						var decojwt = jwt.verify(token, 'hhh420');
						var bytes = cryptojs.AES.decrypt(decojwt.token, 'abc1231@#!');
						var tokendata = JSON.parse(bytes.toString(cryptojs.enc.Utf8));

						user.findById(
							tokendata.id
						).then(function(user) {
							if (user) {
								console.log("user resolved");
								resolve(user);
							} else {
								console.log("user rejected");
								reject();
							}

						}, function(err) {

							reject();
						});

					} catch (e) {

						reject();
					}
				});
			}
		}
	});

	return user;
}

function IS(type, obj) {
	var clas = Object.prototype.toString.call(obj).slice(8, -1);
	return obj !== undefined && obj !== null && type === clas;
}