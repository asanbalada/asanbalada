module.exports = function(sequelize, DataTypes) {
  var Lantaldea = sequelize.define('lantaldea', {
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    email: DataTypes.STRING,
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

  return Lantaldea;
};
