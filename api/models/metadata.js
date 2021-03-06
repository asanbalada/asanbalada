module.exports = function(sequelize, DataTypes) {
  var Metadata = sequelize.define('metadata', {
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    content: DataTypes.TEXT,
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

  return Metadata;
};
