const express = require("express");
const router = express.Router();
const { requireUser } = require("./utilities");
const {
  createActivity,
  updateActivity,
  getAllActivities,
  getPublicRoutinesByActivity,
  getActivityByName,
} = require("../db");

// GET /api/activities/:activityId/routines
router.get("/:activityId/routines", async (req, res, next) => {
  try {
    const id = req.params.activityId;
    const activity = { id: id };
    const routines = await getPublicRoutinesByActivity(activity);
    if (routines.length === 0)
      res.send({
        message: `Activity ${id} not found`,
        name: "ActivityDoesNotExistError",
        error: "Activity does not exist",
      });
    res.send(routines);
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// GET /api/activities

router.get("/", async (req, res, next) => {
  try {
    const activities = await getAllActivities();
    if (activities) {
      res.send(activities);
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// POST /api/activities
router.post("/", requireUser, async (req, res, next) => {
  var authheader = req.headers.authorization;
  console.log(authheader);
  const { name, description } = req.body;
  const activityData = { name, description };
  try {
    const activityName = await getActivityByName(name);
    const activity = await createActivity(activityData);
    if (activityName) {
      res.send({
        name: "ErrorGettingActivities",
        message: "Activity does not exist",
      });
    } else {
      const activityObj = {
        description: description,
        name: name,
      };
      res.send(activityObj);
    }
  } catch (error) {
    next(error);
  }
});

// PATCH /api/activities/:activityId
router.patch("/:activityId", requireUser, async (req, res, next) => {
  console.log(req.body);
  const { activityId } = req.params;
  const { name, description } = req.body;
  const updateFields = {};
  if (name) {
    updateFields.name = name;
  }
  if (description) {
    updateFields.description = description;
  }
  try {
    if (req.user) {
      const updatedActivity = await updateActivity(activityId, updateFields);
      res.send({ activity: updatedActivity });
    } else {
      next({
        name: "UserNotLoggedIn",
        message: "Login to update activity",
      });
    }
  } catch ({ name, description }) {
    next({ name, description });
  }
});
module.exports = router;
// const express = require("express");
// const router = express.Router();
// const {
//   updateActivity,
//   createActivity,
//   getActivityByName,
//   getAllActivities,
//   destroyRoutine,
//   getPublicRoutinesByActivity,
// } = require("../db");
// const jwt = require("jsonwebtoken");
// const authorizeUser = require("./utilities");

// // DELETE /api/routines/:routineId @@@ added since max checked
// router.delete("/:routineId", authorizeUser, async (req, res, next) => {
//   const id = req.params.routineId;
//   try {
//     const routine = await getPublicRoutinesByActivity(id);
//     if (routine.creatorId != req.user.id) {
//       res.status(403);
//       next({
//         name: "UnauthorizedUserError",
//         message: `User ${req.user.username} is not allowed to delete ${routine.name}`,
//       });
//     } else {
//       await destroyRoutine(routine.id);
//       res.send(routine);
//     }
//   } catch ({ name, message }) {
//     next({ name, message });
//   }
// });

// // GET /api/activities/:activityId/routines
// router.get("/:activityId/routines", async (req, res, next) => {
//   try {
//     const routines = await getPublicRoutinesByActivity({
//       id: req.params.activityId,
//     });

//     res.send(routines);
//   } catch (error) {
//     next(error);
//   }
// });

// // GET /api/activities
// router.get("/", async (req, res, next) => {
//   try {
//     const activities = await getAllActivities();

//     res.send(activities);
//   } catch (error) {
//     next(error);
//   }
// });

// // POST /api/activities
// // router.post("/", authorizeUser, async (req, res, next) => {
// //   let authheader = req.headers.authorization;
// //   console.log(authheader);
// //   const { name, description } = req.body;
// //   console.log(req.body.name);
// //   const activityData = { name, description };
// //   try {
// //     const activityName = await getActivityByName(name);
// //     const activity = await createActivity(activityData);
// //     if (activityName) {
// //       res.send({
// //         name: "ErrorGettingActivities",
// //         message: "Activity does not exist",
// //       });
// //     } else {
// //       const activityObj = {
// //         description: description,
// //         name: name,
// //       };
// //       res.send(activityObj);
// //     }
// //   } catch (error) {
// //     next(error);
// //   }
// // });
// router.post("/", async (req, res, next) => {
//   try {
//     const { name, description } = req.body;

//     const activity = await createActivity({ name, description });

//     res.send(activity);
//   } catch (error) {
//     next(error);
//   }
// });

// // PATCH /api/activities/:activityId
// router.patch("/:activityId", async (req, res, next) => {
//   try {
//     const { name, description } = req.body;
//     // console.log(req.body);

//     const activity = await updateActivity({
//       id: req.params.activityId,
//       name,
//       description,
//     });

//     res.send(activity);
//   } catch (error) {
//     next(error);
//   }
// });

// module.exports = router;
