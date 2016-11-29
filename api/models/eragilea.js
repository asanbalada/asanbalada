module.exports = function(sequelize, DataTypes) {
  var Eragilea = sequelize.define('eragilea', {
    mota: DataTypes.STRING, // kolektiboa, norbanako
    abizenak: DataTypes.STRING,
    izena: DataTypes.STRING,
    bio: DataTypes.TEXT,
    telefonoa: DataTypes.STRING,
    eposta: DataTypes.STRING,
    twitter: DataTypes.STRING,
    facebook: DataTypes.STRING,
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
      fullName: function()  {
        return this.izena + (this.abizenak ? ' ' + this.abizenak : '');
      }
    },
  });

  return Eragilea;
};
