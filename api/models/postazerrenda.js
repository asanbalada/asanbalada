module.exports = function(sequelize, DataTypes) {
  var PostaZerrenda = sequelize.define('postazerrenda', {
    title: DataTypes.STRING,
    domain: DataTypes.STRING,
    description: DataTypes.TEXT,
    metadata: {
      type: DataTypes.TEXT,
      allowNull: true,
      get: function () {
        var val = this.getDataValue('metadata');
        if (_.isString(val)) {
          val = JSON.parse(val);
        }
        return val;
      },
      set: function (val) {
        if (_.isObject(val)) {
          val = JSON.stringify(val);
        }
        this.setDataValue('metadata', val);
      }
    }
  },{
    getterMethods: {
      email: function()  {
        return (this.title || '') + '@' + (this.domain || '');
      }
    },
  });

  return PostaZerrenda;
};
