module.exports = function(sequelize, DataTypes) {
  var Proposamena = sequelize.define('proposamena', {
    start: DataTypes.DATE,
    end: DataTypes.DATE,
    title: DataTypes.STRING,
    content: DataTypes.TEXT,
    type: DataTypes.STRING,
    status: DataTypes.STRING,
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
  });

  return Proposamena;
};
