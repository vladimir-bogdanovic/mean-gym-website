const mongoose = require("mongoose");
const _ = require("lodash");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");

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

/// instance methods

UserSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  return _.omit(userObject, ["password", "sessions"]);
};

/// static methods

/// helper methods

/// middleware

const User = mongoose.model("User", UserSchema);
module.exports = { User };

/// REACITVE FORME DA SE STAVE

/// sledeci koraci
/// -napraviti env file i skladistiti JWT sifru unutar istog
/// -napraviti sve metode za usera
/// -napraviti rute za usera u app.js file-u
/// -napraviti servis u frontu za requestove (POST-login/signin za sada)
/// -napraviti interceptor za proveru - da li je accesToken istekao i ako jeste da se refresuje. Takodje da se dodaje acces token na svaki request dok je validan.
/// -napraviti laning-page gde ce user birati izmedju logina i signupa
/// -napraviti skimu za ostale modele
/// -napraviti programs stranicu
/// -napraviti rute za porgrame, MG, exer's
/// -dodati ostale request-metode unutar servisa u frontu
/// -dok je user ulogovan nav se menja (signup i login ==> logout)

/// - posle idemo na exer's page (trebace nam data sa rapid apija unutar MG stranice takodje)
