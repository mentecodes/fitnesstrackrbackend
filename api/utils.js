const authorizeUser = (req, res, next) => {
  if (req.user) {
    console.log("User is set:", req.user);
  }

  next();
};

module.exports = authorizeUser;
