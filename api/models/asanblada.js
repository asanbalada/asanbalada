module.exports = function(sequelize, DataTypes) {
  var Asanblada = sequelize.define('asanblada', {
    date: DataTypes.DATE,
    content: DataTypes.TEXT,
    sended: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
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

  return Asanblada;
};
