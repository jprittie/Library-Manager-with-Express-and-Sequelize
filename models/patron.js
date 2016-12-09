'use strict';
module.exports = function(sequelize, DataTypes) {
  var Patron = sequelize.define('Patron', {
    // id: {
    //   type: DataTypes.INTEGER,
    //   primaryKey: true
    // },
    first_name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "Please enter a first name"
        }
      }
    },
    last_name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "Please enter a last name"
        }
      }
    },
    address: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "Please enter an address"
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "Please enter an email address"
        },
        isEmail: {
          msg: "Please enter a valid email"
        }
      }
    },
    library_id: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "Please enter a library ID"
        }
      }
    },
    zip_code: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: {
          msg: "Please enter a zip code"
        }
      }
    }
  }, {
    classMethods: {
      associate: function(models) {
        Patron.hasMany(models.Loan, {foreignKey: 'patron_id'});
      }
    },
    timestamps: false
  });
  return Patron;
};
