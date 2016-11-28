module.exports = function(sequelize, DataTypes) {
  var Baliabidea = sequelize.define('baliabidea', {
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    usage: DataTypes.TEXT,
    type: DataTypes.STRING,
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

  return Baliabidea;
};
