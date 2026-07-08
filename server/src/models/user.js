export default (sequelize, DataTypes) => {
  // One User represents one KakaoTalk participant or future app account.
  const User = sequelize.define(
    "User",
    {
      loginId: {
        type: DataTypes.STRING(80),
        allowNull: false,
        unique: true,
      },
      passwordHash: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING(80),
        allowNull: false,
      },
    },
    {
      tableName: "users",
      underscored: true,
      indexes: [
        {
          unique: true,
          fields: ["login_id"],
        },
        {
          fields: ["name"],
        },
      ],
    },
  );

  // A participant can send many KakaoTalk text messages.
  User.associate = (models) => {
    User.hasMany(models.Text, {
      as: "texts",
      foreignKey: "userId",
      onDelete: "SET NULL",
      onUpdate: "CASCADE",
    });
  };

  return User;
};
