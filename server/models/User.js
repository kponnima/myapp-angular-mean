let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let bcrypt = require('bcrypt');
// let autoIncrement = require('mongoose-auto-increment');
const saltRounds = 10;

// autoIncrement.initialize(mongoose.connection);

let UserSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: Number,
    required: true
  },
  date_created: {
    type: Date,
    required: true
  },
  role_id: {
    type: Number,
    required: true
  },
  privilege_id: {
    type: Number,
    required: true
  },
  status_id: {
    type: Number,
    required: true
  }
},
  {autoIndex: false},
  {collection: 'users'}
);

UserSchema.pre('save', function(next) {
  let user = this;
  if (this.isModified('password') || this.isNew) {
    bcrypt.genSalt(saltRounds, function(err, salt) {
      if (err) {
        return next(err);
      }
      bcrypt.hash(user.password, salt, function(err, hash) {
        if (err) {
          return next(err);
        }
        user.password = hash;
        next();
      });
    });
  } else {
    return next();
  }
});

UserSchema.methods.comparePassword = function(passw, cb) {
  bcrypt.compare(passw, this.password, function(err, isMatch) {
    if (err) {
      return cb(err);
    }
    cb(null, isMatch);
  });
};

// UserSchema.plugin(autoIncrement.plugin, 'User');
module.exports = mongoose.model('User', UserSchema);