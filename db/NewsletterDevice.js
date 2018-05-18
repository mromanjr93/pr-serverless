const Device = require('./Device');

module.exports = function (sequelize, DataTypes) {
  let NewsletterDevice = sequelize.define('NewsletterDevice', {
    deviceId: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    newsletterId: {
      type: DataTypes.INTEGER,
      primaryKey: true
    }
  }, {
      timestamps: false
    });

  NewsletterDevice.associate = function(models) {
    NewsletterDevice.hasMany(models.Device, { foreignKey: 'deviceId' });
  };
  
  return NewsletterDevice;
}