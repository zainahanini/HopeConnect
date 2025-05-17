module.exports = (sequelize, DataTypes) => {
  const OrphanUpdate = sequelize.define('OrphanUpdate', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    orphan_id: { type: DataTypes.INTEGER, allowNull: false },
    update_type: { type: DataTypes.ENUM('health', 'education', 'photo', 'report'), allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    file_url: { type: DataTypes.STRING },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  }, {
    tableName: 'orphan_updates',
    timestamps: false
  });

  OrphanUpdate.associate = models => {
    OrphanUpdate.belongsTo(models.Orphan, { foreignKey: 'orphan_id' });
  };

  return OrphanUpdate;
};
