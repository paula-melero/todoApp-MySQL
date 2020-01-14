// "use strict";
// module.exports = (sequelize, DataTypes) => {
//   const User = sequelize.define(
//     "User",
//     {
//       username: {
//         type: DataTypes.STRING(30),
//         primaryKey: true,
//         allowNull: false,
//         unique: true,
//         validate: { min: 3 }
//       },
//       password: {
//         type: DataTypes.STRING(999),
//         allowNull: false,
//         validate: { min: 6 }
//       },
//       isAdmin: {
//         type: Sequelize.BOOLEAN,
//         defaultValue: false
//       }
//     },
//     {}
//   );
//   User.associate = function(models) {
//     User.hasMany(models.Task, {
//       as: "createdBy",
//       onDelete: "CASCADE",
//       onUpdate: "CASCADE"
//     });
//   };
//   return User;
// };
