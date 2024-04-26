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
const { functions, remove } = require("lodash");

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

app.patch("/programs/:programId", authenticate, async (req, res) => {
  try {
    const updatedProgram = await Program.findOneAndUpdate(
      {
        _id: req.params.programId,
        _userId: req.user_id,
      },
      { $set: req.body }
    );
    if (updatedProgram) {
      res.send({ message: "Program updated successfully", updatedProgram });
    } else {
      res.status(404).send({ message: "Program not found" });
    }
  } catch (error) {
    console.error("Error updating program:", error);
    res.status(500).send("Internal server error");
  }
});

app.delete("/programs/:programId", authenticate, async (req, res) => {
  try {
    // 1. Delete the program
    const deletedProgram = await Program.findOneAndDelete({
      _id: req.params.programId,
    });
    if (!deletedProgram) {
      console.log("Program not found:", req.params.programId);
      return;
    }
    console.log("Program deleted successfully:", deletedProgram);

    // 3. Delete exercises associated with the deleted mgLists
    const mgLists = await MuscleGroup.find({
      _programId: req.params.programId,
    });
    const mgListIds = mgLists.map((mgList) => mgList._id);
    console.log("mgListIds:", mgListIds);

    if (mgListIds.length > 0) {
      const deletedExercises = await Exercise.deleteMany({
        _muscleId: { $in: mgListIds },
      });
      console.log("Deleted exercises:", deletedExercises);
    } else {
      console.log("No mgLists found for deletion");
    }

    // 2. Delete mgLists associated with the deleted program
    const deletedMgLists = await MuscleGroup.deleteMany({
      _programId: req.params.programId,
    });
    console.log("Deleted mgLists:", deletedMgLists);

    console.log("Program and related data deleted successfully");
  } catch (error) {
    console.error("Error deleting program and related data:", error);
    throw error; // Re-throw the error to be handled by the caller
  }
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

app.patch(
  "/programs/:programsId/mg-lists/:mgListId",
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

      const muscleGroup = await MuscleGroup.findById({
        _id: req.params.mgListId,
      });
      if (!muscleGroup) {
        res.status(404).send("muscle group notddd found");
      }

      muscleGroup.title = req.body.title;

      const updatedMuscleGroup = await muscleGroup.save();
      res.send(updatedMuscleGroup);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
);

app.delete(
  "/programs/:programsId/mg-lists/:mgListId",
  authenticate,
  async (req, res) => {
    try {
      // 1
      const program = await Program.findOne({
        _id: req.params.programsId,
        _userId: req.user_id,
      });
      if (!program) {
        console.log("Program not found:", req.params.programsId);
        return;
      }
      // 3
      const deleteExercisesFromList = await Exercise.deleteMany({
        _muscleId: req.params.mgListId,
      });
      if (!deleteExercisesFromList) {
        console.log("exercises not found", req.params.mgListId);
      }
      // 2
      const muscleGroup = await MuscleGroup.findOneAndDelete({
        _id: req.params.mgListId,
        _programId: req.params.programsId,
      });
      if (!muscleGroup) {
        console.log("Muscle group not found :", req.params.mgListId);
      }

      res.send("Muscle group deleted successfully");
    } catch (error) {
      console.error("Error deleting muscle group:", error);
      res.status(500).send(error.message);
    }
  }
);

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

app.get(
  "/programs/:programsId/mg-lists/:mgListId/exercises",
  authenticate,
  async (req, res) => {
    try {
      const exercises = await Exercise.find({ _muscleId: req.params.mgListId });
      res.send(exercises);
    } catch (error) {
      console.error("Error fetching exercises:", error);
      res.status(500).send("Internal server error");
    }
  }
);

app.patch(
  "/programs/:programsId/mg-lists/:mgListId/exercises/:ExerciseId",
  authenticate,
  async (req, res) => {
    try {
      const program = await Program.findOne({
        _id: req.params.programsId,
        _userId: req.user_id,
      });
      if (!program) {
        res.status(404).send("program not found");
      }

      const muscleGroup = await MuscleGroup.findOne({
        _id: req.params.mgListId,
        _programId: req.params.programsId,
      });
      if (!muscleGroup) {
        res.status(404).send("muscle group not found");
      }

      const exercise = await Exercise.findByIdAndUpdate(
        { _id: req.params.ExerciseId },
        { $set: req.body }
      );
      if (!exercise) {
        res.status(404).send("exercise not found");
      }

      const upadatedExercise = await exercise.save();
      res.send(upadatedExercise);
    } catch (error) {
      res.status(500).send(error);
    }
  }
);

app.delete(
  "/programs/:programsId/mg-lists/:mgListId/exercises/:exerciseId",
  authenticate,
  async (req, res) => {
    try {
      const program = await Program.findOne({
        _id: req.params.programsId,
        _userId: req.user_id,
      });
      if (!program) {
        res.status(404).send("program not found");
      }

      const muscleGroup = await MuscleGroup.findOne({
        _id: req.params.mgListId,
        _programId: req.params.programsId,
      });
      if (!muscleGroup) {
        res.status(404).send("muscle group not found");
      }

      const exercise = await Exercise.findByIdAndDelete({
        _id: req.params.exerciseId,
        _muscleId: req.params.mgListId,
      });
      if (!exercise) {
        res.status(404).send("exercise not found");
      }

      const deletedExercise = await exercise.save();
      res.send(deletedExercise);
    } catch (error) {
      res.status(500).send(error);
    }
  }
);

//LISTENING
app.listen(3000, () => {
  console.log("server is listening on port 3000");
});
