const Sequelize = require("sequelize");
const sequelize = require("../db/index");

const User = sequelize.define(
  "users",
  {
    id: {
      type: Sequelize.DataTypes.UUID,
      field: "id",
      primaryKey: true,
      defaultValue: Sequelize.DataTypes.UUIDV4,
    },
    fullName: {
      type: Sequelize.DataTypes.STRING,
      field: "full_name",
      allowNull: false,
    },
    email: {
      type: Sequelize.DataTypes.STRING,
      field: "email",
      allowNull: false,
      unique: true,
    },
    password: {
      type: Sequelize.DataTypes.STRING,
      field: "password",
      allowNull: false,
    },
    token: {
      type: Sequelize.DataTypes.STRING,
      field: "token",
      allowNull: false,
    }
  },
  {
    paranoid: true,
    timestamps: true,
    underscored: true,
    freezeTableName: true,
    associate: () => {
      User.hasMany("files", { foreignKey: 'user_id' })
    }
  }
);

module.exports = User;

// "use strict";
// module.exports = (sequelize, DataTypes) => {
//   const User = sequelize.define(
//     "users",
//     {
//       id: {
//         type: DataTypes.UUID,
//         field: "id",
//         primaryKey: true,
//         defaultValue: DataTypes.UUIDV4,
//       },
//       fullName: {
//         type: DataTypes.STRING,
//         field: "full_name",
//         allowNull: false,
//       },
//       email: {
//         type: DataTypes.STRING,
//         field: "email",
//         allowNull: false,
//         unique: true,
//       },
//       password: {
//         type: DataTypes.STRING,
//         field: "password",
//         allowNull: false,
//       },
//     },
//     {
//       paranoid: true,
//       timestamps: true,
//       underscored: true,
//       freezeTableName: true,
//     }
//   );

//   // User.associate = function (models) {
//   //   User.hasMany(models.File, { foreignKey: "uploadedBy" });
//   // };

//   return User;
// };
