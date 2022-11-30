const express = require("express");
const router = express.Router();
// took from juicebox
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { JWT_SECRET = "neverTell" } = process.env;
const {
  getAllUsers,
  createUser,
  getUserByUsername,
  getAllRoutinesByUser,
  getPublicRoutinesByUser,
} = require("../db");
const { requireUser } = require("./utilities");

// POST /api/users/login
router.post("/login", async (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.send({
      name: "MissingCredentialsError",
      message: "Please suppy both a username and password",
    });
  }
  try {
    const user = await getUserByUsername(username);
    const hashedPassword = user.password;
    if (user && (await bcrypt.compare(password, hashedPassword))) {
      const jwtToken = jwt.sign(user, JWT_SECRET);
      res.send({ user: user, token: jwtToken, message: "you're logged in!" });
    } else {
      next({
        name: "IncorrectCredentialsError",
        message: "Username or password is incorrect",
      });
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// POST /api/users/register
router.post("/register", async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const _user = await getUserByUsername(username);
    if (_user) {
      res.send({
        error: "UserExistsError",
        message: "User " + username + " is already taken.",
        name: "UsernameExists",
      });
    } else if (password.length < 8) {
      res.send({
        error: "PasswordLengthError",
        message: "Password Too Short!",
        name: "Short Password",
      });
    } else {
      const user = await createUser({ username, password });

      if (user) {
        const jwtToken = jwt.sign(user, JWT_SECRET);
        const response = {
          message: "thank you for signing up",
          token: jwtToken,
          user: {
            id: user.id,
            username: user.username,
          },
        };
        res.send(response);
      }
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// GET /api/users/me
router.get("/me", async (req, res, next) => {
  // const token = req.headers["authorization"];
  //   const token = authHeader && authHeader.split(" ")[1];
  // console.log(token)
  try {
    if (req.user) {
      res.send(req.user);
    } else {
      res.status(401).send({
        error: "401 - Unauthorized",
        message: "You must be logged in to perform this action",
        name: "UnauthorizedError",
      });
    }
  } catch (error) {
    next(error);
  }
});

// GET /api/users/:username/routines
router.get("/:username/routines", requireUser, async (req, res, next) => {
  try {
    console.log("0");
    const { username } = req.params;
    const user = await getUserByUsername(username);
    console.log("1");
    if (!user) {
      console.log("3");
      res.send({
        name: "NoUser",
        message: `Error looking up user ${username}`,
      });
    } else if (req.user && user.id === req.user.id) {
      console.log("4");
      const routines = await getAllRoutinesByUser({ username: username });
      res.send(routines);
    } else {
      console.log("5");
      const routines = await getPublicRoutinesByUser({ username: username });
      res.send(routines);
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
// const express = require("express");
// const router = express.Router();
// const {
//   createUser,
//   getUserByUsername,
//   getUser,
//   getUserById,
//   getPublicRoutinesByUser,
//   getAllRoutinesByUser,
// } = require("../db");
// const jwt = require("jsonwebtoken");
// const { JWT_SECRET } = process.env;
// const authorizeUser = require("./utilities");

// // POST /api/users/login

// router.post("/login", async (req, res, next) => {
//   try {
//     const { username, password } = req.body;

//     //getUser already checks for password match
//     const user = await getUser({ username, password });
//     console.log(user);
//     if (!user) {
//       next({ message: "user does not exists" });
//     }
//     // console.log(username, password);
//     // console.log(user);

//     const token = jwt.sign(
//       { id: user.id, username: user.username },
//       JWT_SECRET
//     );

//     // console.log({ user, token });

//     res.send({ user, token });
//   } catch (error) {
//     next(error);
//   }
// });

// // POST /api/users/register
// router.post("/register", async (req, res, next) => {
//   const { username, password } = req.body;
//   // const userCheck = await createUser({
//   //   username,
//   //   password,
//   // });
//   try {
//     if (password.length < 8) {
//       next({
//         name: "PasswordShortError",
//         message: `Password Too Short!`,
//         error: "Error!",
//       });
//     }

//     if (await getUserByUsername(username)) {
//       next({
//         name: "UserExistError",
//         message: `User ${username} is already taken.`,
//         error: "Error!",
//       });
//     }
//     const response = await createUser({ username, password });
//     // console.log(response);
//     const token = jwt.sign(
//       {
//         // id: user.id,
//         id: response.id,
//         // id: userCheck.id,
//         username,
//       },
//       process.env.JWT_SECRET,
//       { expiresIn: "1w" }
//     );

//     res.send({
//       message: "Thank you for signing up",
//       token,
//       user: response,
//     });
//   } catch (error) {
//     next(error.message);
//   }
// });
// //@@@@@@ test 2

// // router.post("/register", async (req, res, next) => {
// //   const { username, password } = req.body;
// //   const _user = await getUserByUsername(username);
// //   try {
// //     if (_user) {
// //       res.status(409);
// //       next({
// //         name: "UserExistsError",
// //         message: "A user by that username already exists",
// //       });
// //     } else if (password.length < 8) {
// //       res.status(411);
// //       next({
// //         name: "Password Error",
// //         message: "Password must be a minimum of 8 characters",
// //       });
// //     } else {
// //       const user = await createUser({
// //         username,
// //         password,
// //       });
// //       const token = jwt.sign(
// //         {
// //           id: user.id,
// //           username,
// //         },
// //         process.env.JWT_SECRET,
// //         {
// //           expiresIn: "1w",
// //         }
// //       );
// //       res.send({
// //         user,
// //         token,
// //       });
// //     }
// //   } catch ({ name, message }) {
// //     next({ name, message });
// //   }
// // });

// //@@@@@@ test 3
// // router.post("/register", async (req, res, next) => {
// //   try {
// //     const { username, password } = req.body;
// //     console.log(req.body);
// //     if (password.length < 8) {
// //       throw new Error("password length must be at least 8 characters");
// //     }
// //     const userCheck = await getUser({ username, password });
// //     if (!userCheck) {
// //       next({ message: "user already exists" });
// //     }
// //     const user = await createUser({ username, password });

// //     //gonna try adding token to see if that fixes the problem...?
// //     const token = jwt.sign(
// //       { id: user.id, username: user.username },
// //       JWT_SECRET
// //     );

// //     // console.log({ user, token });

// //     res.send({ user, token });
// //     // res.send({ token });
// //   } catch (error) {
// //     next(error);
// //   }
// // });

// // GET /api/users/me

// router.get("/me", authorizeUser, async (req, res, next) => {
//   try {
//     const user = await getUserById(req.user.id);

//     res.send(user);
//   } catch (error) {
//     next(error);
//   }
// });

// // GET /api/users/:username/routines

// router.get("/:username/routines", async (req, res, next) => {
//   try {
//     // lets check the authorization headers
//     // for a token
//     const auth = req.header("Authorization");
//     const token = auth.split(" ")[1];
//     let routines;

//     // then, lets verify the token with jwt.verify()
//     // and get access to the user's username
//     const { username } = jwt.verify(token, JWT_SECRET);

//     // then, we can compare the username to the username on this route
//     // if they match, we'll return getAllRoutinesByUser()
//     // if they don't match, we'll return the public routines only
//     if (username === req.params.username) {
//       routines = await getAllRoutinesByUser({
//         username: req.params.username,
//       });
//     } else {
//       routines = await getPublicRoutinesByUser({
//         username: req.params.username,
//       });
//     }

//     res.send(routines);
//   } catch (error) {
//     next(error);
//   }
// });

// module.exports = router;
