require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const router = require("./api");

app.use(cors());
app.use(express.json());

const morgan = require("morgan");
app.use(morgan("dev"));

// Setup your Middleware and API Router here
app.get("/", function (req, res) {
  res.send({ msg: "home" });
});

app.use("/api", router);

module.exports = app;
// require("dotenv").config();
// const express = require("express");
// const jwt = require("jsonwebtoken");
// const { getUserById } = require("./db");
// const { JWT_SECRET } = process.env;
// const app = express();

// // Setup your Middleware and API Router here
// app.use(express.json());
// app.use(async (req, res, next) => {
//   const prefix = "Bearer ";
//   const auth = req.header("Authorization");

//   if (!auth) {
//     // nothing to see here
//     next();
//   } else if (auth.startsWith(prefix)) {
//     const token = auth.slice(prefix.length);

//     try {
//       const { id } = jwt.verify(token, JWT_SECRET);

//       if (id) {
//         req.user = await getUserById(id);
//         next();
//       }
//     } catch ({ name, message }) {
//       next({ name, message });
//     }
//   } else {
//     next({
//       name: "AuthorizationHeaderError",
//       message: `Authorization token must start with ${prefix}`,
//     });
//   }
// });

// // app.use((req, res, next) => {
// //   if (req.user) {
// //     console.log("User is set:", req.user);
// //   }

// //   next();
// // });

// const router = require("./api");
// app.use("/api", router);
// module.exports = app;
