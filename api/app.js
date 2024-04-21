require("dotenv").config();

const express = require("express");
const app = express();
app.use(express.json());
const mongoose = require("./db/mongoose");

const jwt = require("jsonwebtoken");

const { User } = require("./db/models/user.model");
const { Program } = require("./db/models/program.model");
const { MuscleGroup } = require("./db/models/muscle-group.model");
const { Exercise } = require("./db/models/exercise.model");

const jwtSecret = process.env.JWT_SECRET;

// enable cors
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, HEAD, OPTIONS, PUT, PATCH, DELETE"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, x-access-token, x-refresh-token, _id"
  );
  res.header(
    "Access-Control-Expose-Headers",
    "x-access-token, x-refresh-token"
  );
  next();
});

/// MIDLLEWARE;

let authenticate = (req, res, next) => {
  let token = req.header("x-access-token");
  jwt.verify(token, jwtSecret, (err, decoded) => {
    if (err) {
      res.status(401).send(err);
    } else {
      req.user_id = decoded._id;
      console.log(decoded);
      next();
    }
  });
};

let verifySession = (req, res, next) => {
  let refreshToken = req.header("x-refresh-token");
  let _id = req.header("_id");

  User.findByIdAndToken(_id, refreshToken)
    .then((user) => {
      if (!user) {
        return Promise.reject({
          error:
            "User not found. Make sure that the refresh token and user id are correct",
        });
      }
      req.user_id = user._id;
      req.userObject = user;
      req.refreshToken = refreshToken;

      let isSessionValid = false;

      user.sessions.forEach((session) => {
        if (session.token === refreshToken) {
          // check if the session has expired
          if (User.hasRefreshTokenExpired(session.expiresAt) === false) {
            // refresh token has not expired
            isSessionValid = true;
          }
        }
      });
      if (isSessionValid) {
        next();
      } else {
        return Promise.reject({
          error: "Refresh token has expired or the session is invalid",
        });
      }
    })
    .catch((e) => {
      res.status(401).send(e);
    });
};

//  USER ROUTES

// POST
//signin
app.post("/users", (req, res) => {
  let body = req.body;
  let newUser = new User(body);

  newUser
    .save()
    .then(() => {
      return newUser.createSession();
    })
    .then((refreshToken) => {
      return newUser.generateAccessAuthToken().then((accessToken) => {
        return { accessToken, refreshToken };
      });
    })
    .then((authTokens) => {
      res
        .header("x-refresh-token", authTokens.refreshToken)
        .header("x-access-token", authTokens.accessToken)
        .send(newUser);
    })
    .catch((err) => {
      res.send(err);
    });
});

//POST
//login

app.post("/users/login", (req, res) => {
  let email = req.body.email;
  let password = req.body.password;

  User.findByCredentials(email, password)
    .then((user) => {
      return user
        .createSession()
        .then((refreshToken) => {
          return user.generateAccessAuthToken().then((accessToken) => {
            return { accessToken, refreshToken };
          });
        })
        .then((authTokens) => {
          res
            .header("x-refresh-token", authTokens.refreshToken)
            .header("x-access-token", authTokens.accessToken)
            .send(user);
        })
        .then(() => {
          res.send(authTokens);
        });
    })
    .catch((e) => {
      res.status(e);
    });
});

//   GET ACCESS TOKEN
app.get("/users/me/access-token", verifySession, (req, res) => {
  req.userObject.generateAccessAuthToken().then((accessToken) => {
    res.header("x-access-token", accessToken);
    res.send({ accessToken });
  });
  // .catch((e) => {
  //   res.status(400).send(e);
  // });
});

/// PROGRAMS ROUTES

app.post("/programs", authenticate, (req, res) => {
  let title = req.body.title;

  let newTitle = new Program({
    title: title,
    _userId: req.user_id,
  });
  newTitle.save().then((program) => {
    res.send(program);
    res.send(console.log(title, newTitle));
  });
});

app.get("/programs", authenticate, (req, res) => {
  Program.find({
    _userId: req.user_id,
  })
    .then((program) => {
      res.send(program);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("An error occurred while fetching programs.");
    });
});

/// MG's ROUTES

app.post("/programs/:programsId/mg-lists", authenticate, (req, res) => {
  Program.findOne({
    _id: req.params.programsId,
    _userId: req.user_id,
  })
    .then((program) => {
      if (program) {
        return true;
      } else {
        return false;
      }
    })
    .then((canCreateList) => {
      if (canCreateList) {
        let newList = new MuscleGroup({
          title: req.body.title,
          _programId: req.params.programsId,
        });

        newList.save().then((newList) => {
          res.send(newList);
        });
      } else {
        res.sendStatus(404);
      }
    });
});

app.get("/programs/:programsId/mg-lists", authenticate, (req, res) => {
  MuscleGroup.find({ _programId: req.params.programsId })
    .then((muscleGroup) => {
      res.send(muscleGroup);
    })
    .catch((err) => {
      console.log(`this is Response error : ${err}`);
    });
});

/// EXERCISES ROUTES

app.post(
  "/programs/:programsId/mg-lists/:mgListId/exercises",
  authenticate,
  async (req, res) => {
    try {
      const program = await Program.findOne({
        _id: req.params.programsId,
        _userId: req.user_id,
      });
      if (!program) {
        res.status(404).send("Program notddd found");
        return;
      }

      const mgList = await MuscleGroup.findOne({
        _id: req.params.mgListId,
        _programId: req.params.programsId,
      });
      if (!mgList) {
        res.status(404).send("Muscle group not found");
        return;
      }

      const newExercise = new Exercise({
        title: req.body.title,
        _muscleId: req.params.mgListId,
      });

      const savedExercise = await newExercise.save();
      res.send(savedExercise);
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send("Internal server error");
    }
  }
);

// app.post("/programs/:programsId/mg-lists/:mgListId/exercises", (req, res) => {
//   Program.findOne({ _id: req.params.programsId, _userId: req._userId })
//     .then((program) => {
//       if (program) {
//         return true;
//       } else {
//         res.status(404).send("Program not found");
//         return;
//       }
//     })
//     .then((mgList) => {
//       if (mgList) {
//         MuscleGroup.findOne({
//           _id: req.params.mgListId,
//           _programId: req.params.programsId,
//         }).then((canCreateExercise) => {
//           if (canCreateExercise) {
//             let newExersice = new Exercise({
//               title: req.body.title,
//               _muscleId: req.params.mgListId,
//             });

//             newExersice.save().then((newExer) => {
//               res.send(newExer);
//             });
//           }
//         });
//       } else {
//         res.status(404);
//       }
//     });
// });

//LISTENING
app.listen(3000, () => {
  console.log("server is listening on port 3000");
});
