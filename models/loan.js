// MUST CHECK VALIDATON i.e. allowNull and isDate vs. notEmpty

'use strict';
module.exports = function(sequelize, DataTypes) {
  var Loan = sequelize.define('Loan', {
    // id: {
    //     type: DataTypes.INTEGER,
    //     primaryKey: true
    // },
    book_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    patron_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    loaned_on: {
      type: DataTypes.DATEONLY,
      validate: {
        isDate: {
          msg: "Please enter a loaned-on date"
        }
      }
    },
    return_by: {
      type: DataTypes.DATEONLY,
      validate: {
        isDate: {
          msg: "Please enter a return-by date"
        }
      }
    },
    returned_on: {
      type: DataTypes.DATEONLY,
      validate: {
        isDate: {
          msg: "Please enter a returned-on date"
        }
      }
    }
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        Loan.belongsTo(models.Patron, {foreignKey: 'patron_id'});
        Loan.belongsTo(models.Book, {foreignKey: 'book_id'});
      }
    },
    timestamps: false
  });
  return Loan;
};
