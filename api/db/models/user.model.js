// /// REACITVE FORME DA SE STAVE

// /// sledeci koraci

// /// -napraviti interceptor za proveru - da li je accesToken istekao i ako jeste da se refresuje. Takodje da se dodaje acces token na svaki request dok je validan.
// /// -napraviti laning-page gde ce user birati izmedju logina i signupa
// /// -napraviti skimu za ostale modele
// /// -napraviti programs stranicu
// /// -napraviti rute za porgrame, MG, exer's
// /// -dodati ostale request-metode unutar servisa u frontu
// /// -dok je user ulogovan nav se menja (signup i login ==> logout)

// /// - posle idemo na exer's page (trebace nam data sa rapid apija unutar MG stranice takodje)

//==================================================================================================================

const mongoose = require("mongoose");
const _ = require("lodash");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
require("dotenv").config();

// JWT Secret
const jwtSecret = process.env.JWT_SECRET;

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  sessions: [
    {
      token: {
        type: String,
        required: true,
      },
      expiresAt: {
        type: Number,
        required: true,
      },
    },
  ],
});

// *** Instance methods ***

UserSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  // return the document except the password and sessions
  return _.omit(userObject, ["password", "sessions"]);
};

UserSchema.methods.generateAccessAuthToken = function () {
  const user = this;
  return new Promise((resolve, reject) => {
    // Create the JSON Web Token and return that
    jwt.sign(
      { _id: user._id.toHexString() },
      jwtSecret,
      { expiresIn: "15m" },
      (err, token) => {
        if (!err) {
          resolve(token);
        } else {
          reject();
        }
      }
    );
  });
};

UserSchema.methods.generateRefreshAuthToken = function () {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(64, (err, buf) => {
      if (!err) {
        let token = buf.toString("hex");

        return resolve(token);
      }
    });
  });
};

UserSchema.methods.createSession = function () {
  let user = this;

  return user
    .generateRefreshAuthToken()
    .then((refreshToken) => {
      return saveSessionToDatabase(user, refreshToken);
    })
    .then((refreshToken) => {
      // saved to database successfully
      // now return the refresh token
      return refreshToken;
    })
    .catch((e) => {
      return Promise.reject("Failed to save session to database.\n" + e);
    });
};

/* MODEL METHODS (static methods) */

UserSchema.statics.getJWTSecret = () => {
  return jwtSecret;
};

UserSchema.statics.findByIdAndToken = function (_id, token) {
  // used in auth middleware (verifySession)
  const User = this;
  return User.findOne({
    _id,
    "sessions.token": token,
  });
};

UserSchema.statics.findByCredentials = function (email, password) {
  let User = this;
  return User.findOne({ email }).then((user) => {
    if (!user) return Promise.reject();

    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          resolve(user);
        } else {
          reject();
        }
      });
    });
  });
};

UserSchema.statics.hasRefreshTokenExpired = (expiresAt) => {
  let exparationDate = Date.now() / 1000;
  if (expiresAt > exparationDate) {
    // hasn't expired
    return false;
  } else {
    // has expired
    return true;
  }
};

/* MIDDLEWARE */
// Before a user document is saved, this code runs
UserSchema.pre("save", function (next) {
  let user = this;
  let costFactor = 10;

  if (user.isModified("password")) {
    // Generate salt and hash password
    bcrypt.genSalt(costFactor, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

/* HELPER METHODS */
let saveSessionToDatabase = (user, refreshToken) => {
  // Save session to database
  return new Promise((resolve, reject) => {
    let expiresAt = generateRefreshTokenExpiryTime();

    user.sessions.push({ token: refreshToken, expiresAt });

    user
      .save()
      .then(() => {
        // saved session successfully
        return resolve(refreshToken);
      })
      .catch((e) => {
        reject(e);
      });
  });
};

let generateRefreshTokenExpiryTime = () => {
  let daysUntilExpire = "10";
  let secondsUntilExpire = daysUntilExpire * 24 * 60 * 60;

  return Date.now() / 1000 + secondsUntilExpire;
};

const User = mongoose.model("User", UserSchema);

module.exports = { User };
