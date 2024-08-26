const Sequelize = require("sequelize");
const sequelize = require("../db/index");

const File = sequelize.define(
  "files",
  {
    id: {
      type: Sequelize.DataTypes.UUID,
      field: "id",
      primaryKey: true,
      defaultValue: Sequelize.DataTypes.UUIDV4,
    },
    fileName: {
      type: Sequelize.DataTypes.STRING,
      field: "full_name",
      allowNull: false,
    },
    fileSize: {
      type: Sequelize.DataTypes.STRING,
      field: "file_size",
      allowNull: false,
      // unique: true,
    },
    uploadedBy: {
      type: Sequelize.DataTypes.STRING,
      field: "uploaded_by",
      allowNull: false,
      references: {
        model: {
          tableName: 'Users',
          // schema: 'public',                      
        },
        key: 'id'
      }
    }
  },
  {
    paranoid: true,
    timestamps: true,
    underscored: true,
    freezeTableName: true,
    associate: () => {
      File.belongsTo("Users", { foreignKey: 'user_id' })
    }
  }
);

module.exports = File;

