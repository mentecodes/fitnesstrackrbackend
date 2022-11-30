const express = require("express");
const router = express.Router();
const {
  getRoutineActivityById,
  getRoutineById,
  updateRoutineActivity,
  destroyRoutineActivity,
} = require("../db");

// PATCH /api/routine_activities/:routineActivityId
router.patch("/:routineActivityId", async (req, res, next) => {
  const { count, duration } = req.body;
  const id = req.params.routineActivityId;
  try {
    const routineActivity = await getRoutineActivityById(id);
    const routine = await getRoutineById(routineActivity.routineId);
    if (req.user.id !== routine.creatorId) {
      next({ name: "Must be a user" });
    } else {
      const updatedRoutineAct = await updateRoutineActivity({
        id,
        count,
        duration,
      });
      if (updatedRoutineAct) {
        res.send(updatedRoutineAct);
      } else {
        next({ name: "Routine does not exist" });
      }
    }
  } catch (error) {
    next(error);
  }
});

// DELETE /api/routine_activities/:routineActivityId
router.delete("/:routineActivityId", async (req, res, next) => {
  const { routineActivityId } = req.params;
  try {
    const routineActivity = await getRoutineActivityById(routineActivityId);
    const routine = await getRoutineById(routineActivity.routineId);
    if (req.user.id === routine.creatorId) {
      const destroyActivity = await destroyRoutineActivity(routineActivityId);
      res.send(destroyActivity);
    } else {
      next({ message: "Error: Only the creator can delete a routine" });
    }
  } catch ({ message }) {
    next({ message });
  }
});
module.exports = router;
// const express = require("express");
// const router = express.Router();
// const {
//   updateRoutineActivity,
//   getRoutineActivityById,
//   getRoutineById,
//   destroyRoutineActivity,
// } = require("../db");
// // const jwt = require("jsonwebtoken");
// const authorizeUser = require("./utilities");

// async function checkUserOwnsRoutine(req, res, next) {
//   try {
//     const { routineId } = await getRoutineActivityById(
//       req.params.routineActivityId
//     );

//     const routine = await getRoutineById(routineId);

//     if (+routine.creatorId !== +req.user.id) {
//       throw new Error("Users can only modify routines that they have created");
//     }

//     next();
//   } catch (error) {
//     next(error);
//   }
// }

// // PATCH /api/routine_activities/:routineActivityId
// router.patch(
//   "/:routineActivityId",
//   [authorizeUser, checkUserOwnsRoutine],
//   async (req, res, next) => {
//     try {
//       const { count, duration } = req.body;

//       const rouAct = await updateRoutineActivity({
//         id: req.params.routineActivityId,
//         count,
//         duration,
//       });

//       res.send(rouAct);
//     } catch (error) {
//       next(error);
//     }
//   }
// );

// // DELETE /api/routine_activities/:routineActivityId
// router.delete(
//   "/:routineActivityId",
//   [authorizeUser, checkUserOwnsRoutine],
//   async (req, res, next) => {
//     console.log("made it into rouActsRouter.delete");
//     try {
//       const destroyedRouAct = await destroyRoutineActivity(
//         req.params.routineActivityId
//       );

//       console.log("made it to line 75 in rouActsRoute.delete");

//       res.send(destroyedRouAct);
//     } catch (error) {
//       next(error);
//     }
//   }
// );

// module.exports = router;
