var cryptojs = require('crypto-js');

module.exports = function(sequelize, DataTypes) {

	return sequelize.define('tokens', {
		token: {
			type: DataTypes.VIRTUAL,
			allowNull: false,
			validate: {
				len: [1]
			},
			set: function(value) {
				var hash = cryptojs.MD5(value).toString();
				console.log(' setting Md 5 value is ' + hash);
				this.setDataValue('token', value);
				this.setDataValue('tokenHash', hash);

			}
		},
		tokenHash: DataTypes.STRING
	});
};