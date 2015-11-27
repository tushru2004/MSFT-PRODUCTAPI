module.exports = function(sequelize,DataTypes){

	return sequelize.define('products',{
		description: {
			type: DataTypes.STRING,
			allowNull :false,
			validate : {
				len :[1,250]
			}
		},
		name: {
			type: DataTypes.STRING,
			allowNull :false,
			validate : {
				len :[1,250]
			}
		},
		manufacturer: {
			type: DataTypes.STRING,
			allowNull :false,
			validate : {
				len :[1,250]
			}
		},
		isecofriendly :  {
			type: DataTypes.BOOLEAN,
			allowNull :false,
			validate : {
				len :[1,250]
			}
		}
	});

}