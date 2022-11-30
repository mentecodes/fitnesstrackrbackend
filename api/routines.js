const express = require("express");
const routinesRouter = express.Router();
const {
  getAllPublicRoutines,
  createRoutine,
  getRoutineById,
  updateRoutine,
  destroyRoutine,
  addActivityToRoutine,
  getRoutineActivityById,
} = require("../db");
const { requireUser } = require("./utilities");

// GET /api/routines
routinesRouter.get("/", async (req, res) => {
  const allRoutines = await getAllPublicRoutines();
  res.send(allRoutines);
});

// POST /api/routines
routinesRouter.post("/", requireUser, async (req, res, next) => {
  const { isPublic, name, goal } = req.body;
  const creatorId = req.user.id;

  try {
    if (creatorId && isPublic && name && goal) {
      const newRoutine = await createRoutine({
        creatorId,
        isPublic,
        name,
        goal,
      });
      res.send(newRoutine);
    } else {
      res.send({ message: "Missing fields" });
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// PATCH /api/routines/:routineId
routinesRouter.patch("/:routineId", requireUser, async (req, res, next) => {
  const { routineId } = req.params;

  try {
    if (Object.keys(req.body).length === 0) {
      throw Error("No update fields");
    }

    const updateFields = { id: routineId, ...req.body };

    const updatedRoutine = await updateRoutine(updateFields);
    res.send(updatedRoutine);
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// DELETE /api/routines/:routineId
routinesRouter.delete("/:routineId", requireUser, async (req, res, next) => {
  const id = req.params.routineId;
  try {
    const routine = await getRoutineById(id);
    if (routine.creatorId != req.user.id) {
      res.status(403);
      next({
        name: "UnauthorizedUserError",
        message: `User ${req.user.username} is not allowed to delete ${routine.name}`,
      });
    } else {
      await destroyRoutine(routine.id);
      res.send(routine);
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// POST /api/routines/:routineId/activities
routinesRouter.post(
  "/:routineId/activities",
  requireUser,
  async (req, res, next) => {
    const { activityId, duration, count } = req.body;
    const { routineId } = req.params;
    const routineActId = await getRoutineActivityById(activityId);
    try {
      if (routineActId) {
        res.send({
          error: "Existing Id Error",
          message: `Activity ID ${activityId} already exists in Routine ID ${routineId}`,
          name: "ExistingIdError",
        });
      } else {
        const addedActivity = await addActivityToRoutine({
          routineId,
          activityId,
          duration,
          count,
        });
        res.send(addedActivity);
      }
    } catch ({ name, message }) {
      next({ name, message });
    }
  }
);
module.exports = routinesRouter;
// const express = require("express");
// const router = express.Router();

// const {
//   getAllPublicRoutines,
//   createRoutine,
//   updateRoutine,
//   destroyRoutine,
//   getRoutineActivitiesByRoutine,
//   destroyRoutineActivity,
//   addActivityToRoutine,
// } = require("../db");
// // const jwt = require("jsonwebtoken");
// const authorizeUser = require("./utilities");

// //update with post, routines @@@@ needs review
// router.post("/", authorizeUser, async (req, res, next) => {
//   const { isPublic, name, goal } = req.body;
//   const creatorId = req.user.id;

//   try {
//     if (creatorId && isPublic && name && goal) {
//       const newRoutine = await createRoutine({
//         creatorId,
//         isPublic,
//         name,
//         goal,
//       });
//       res.send(newRoutine);
//     } else {
//       res.send({ message: "Missing fields" });
//     }
//   } catch ({ name, message }) {
//     next({ name, message });
//   }
// });

// // GET /api/routines

// router.get("/", async (req, res, next) => {
//   try {
//     const routines = await getAllPublicRoutines();

//     res.send(routines);
//   } catch (error) {
//     next(error);
//   }
// });

// // POST /api/routines
// router.post("/", authorizeUser, async (req, res, next) => {
//   try {
//     const { isPublic, name, goal } = req.body;

//     const routine = await createRoutine({
//       creatorId: req.user.id,
//       isPublic,
//       name,
//       goal,
//     });

//     res.send(routine);
//   } catch (error) {
//     next(error);
//   }
// });

// // PATCH /api/routines/:routineId

// router.patch("/:routineId", async (req, res, next) => {
//   try {
//     const { isPublic, name, goal } = req.body;

//     const routine = await updateRoutine({
//       id: req.params.routineId,
//       isPublic,
//       name,
//       goal,
//     });

//     res.send(routine);
//   } catch (error) {
//     next(error);
//   }
// });

// // DELETE /api/routines/:routineId

// router.delete("/:routineId", authorizeUser, async (req, res, next) => {
//   try {
//     const routineActivitiesToDelete = await getRoutineActivitiesByRoutine({
//       routineId: req.params.routineId,
//     });

//     for (let i = 0; i < routineActivitiesToDelete.length; i++) {
//       await destroyRoutineActivity(routineActivitiesToDelete[i].id);
//     }

//     const deletedRoutine = await destroyRoutine(req.params.routineId);

//     res.send(deletedRoutine);
//   } catch (error) {
//     next(error);
//   }
// });

// // POST /api/routines/:routineId/activities

// router.post("/:routineId/activities", async (req, res, next) => {
//   // console.log("made it to line 96 inside routinesRouter.post");
//   try {
//     // console.log("made it to line 98 in routinesRouter.post");
//     const { activityId, count, duration } = req.body;
//     // console.log(
//     //   "activityId, count, and duration from inside routinesRouter.post:",
//     //   activityId,
//     //   count,
//     //   duration
//     // );

//     const activity = await addActivityToRoutine({
//       routineId: req.params.routineId,
//       activityId,
//       count,
//       duration,
//     });

//     // console.log("you made it to line 114 in routinesRouter.post");
//     // console.log("activity:", activity);

//     res.send(activity);
//   } catch (error) {
//     next(error);
//   }
// });

// module.exports = router;
