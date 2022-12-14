function requireUser(req, res, next) {
  if (!req.user) {
    res.status(401);
    res.send({
      error: "User not logged in",
      name: "MissingUserError",
      message: "You must be logged in to perform this action",
    });
  }
  next();
}
module.exports = {
  requireUser,
};
// const authorizeUser = (req, res, next) => {
//   if (req.user) {
//     console.log("User is set:", req.user);
//   }

//   next();
// };

// module.exports = authorizeUser;
