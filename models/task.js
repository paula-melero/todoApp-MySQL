// "use strict";

//   const Task = sequelize.define(
//     "Task",
//     {
//       title: {
//         type: DataTypes.String(30),
//         allowNull: false,
//         validate: { min: 3 }
//       },
//       description: {
//         type: DataTypes.TEXT,
//         allowNull: false,
//         validate: { min: 6 }
//       },
//       status: {
//         type: DataTypes.STRING,
//         defaultValue: "to do",
//         validate: {
//           isIn: [["to do", "done"]]
//         }
//       },
//       createdBy: {
//         type: DataTypes.INTEGER,
//         allowNull: false
//       }
//     },
//     {}
//   );
//   Task.associate = function(models) {
//     Task.belongsTo(models.User, { foreignKey: "createdBy", as: "id" });
//   };
//   return Task;
