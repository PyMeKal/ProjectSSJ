export default (sequelize, DataTypes) => {
  // One Text row stores one parsed KakaoTalk message.
  const Text = sequelize.define(
    "Text",
    {
      sourceFile: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      sentAt: {
        // Full timestamp for ordering messages chronologically.
        type: DataTypes.DATE,
        allowNull: false,
      },
      sentDate: {
        // Split date fields make daily/monthly/yearly analysis easier.
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      sentYear: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      sentMonth: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        validate: {
          min: 1,
          max: 12,
        },
      },
      sentDay: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        validate: {
          min: 1,
          max: 31,
        },
      },
      sentTime: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      sentHour: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        validate: {
          min: 0,
          max: 23,
        },
      },
      sender: {
        type: DataTypes.STRING(80),
        allowNull: false,
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      tableName: "texts",
      underscored: true,
      indexes: [
        {
          fields: ["sent_date"],
        },
        {
          fields: ["sent_year", "sent_month", "sent_day"],
        },
        {
          fields: ["sent_hour"],
        },
        {
          fields: ["sender"],
        },
        {
          fields: ["user_id"],
        },
      ],
    },
  );

  // Each message can point to the User who sent it.
  Text.associate = (models) => {
    Text.belongsTo(models.User, {
      as: "user",
      foreignKey: "userId",
      onDelete: "SET NULL",
      onUpdate: "CASCADE",
    });
  };

  return Text;
};
