module.exports = (sequelize, DataTypes) => {
  return sequelize.define('campaign_contribution', {
    user_id: DataTypes.INTEGER,
    campaign_id: DataTypes.INTEGER,
    amount: DataTypes.DECIMAL(10, 2),
  });
};
