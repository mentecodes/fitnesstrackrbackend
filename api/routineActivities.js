const express = require("express");
const router = express.Router();
const {
  updateRoutineActivity,
  getRoutineActivityById,
  getRoutineById,
  destroyRoutineActivity,
} = require("../db");
// const jwt = require("jsonwebtoken");
const authorizeUser = require("./utils");

async function checkUserOwnsRoutine(req, res, next) {
  try {
    const { routineId } = await getRoutineActivityById(
      req.params.routineActivityId
    );

    const routine = await getRoutineById(routineId);

    if (+routine.creatorId !== +req.user.id) {
      throw new Error("Users can only modify routines that they have created");
    }

    next();
  } catch (error) {
    next(error);
  }
}

// PATCH /api/routine_activities/:routineActivityId
router.patch(
  "/:routineActivityId",
  [authorizeUser, checkUserOwnsRoutine],
  async (req, res, next) => {
    try {
      const { count, duration } = req.body;

      const rouAct = await updateRoutineActivity({
        id: req.params.routineActivityId,
        count,
        duration,
      });

      res.send(rouAct);
    } catch (error) {
      next(error);
    }
  }
);

// DELETE /api/routine_activities/:routineActivityId
router.delete(
  "/:routineActivityId",
  [authorizeUser, checkUserOwnsRoutine],
  async (req, res, next) => {
    console.log("made it into rouActsRouter.delete");
    try {
      const destroyedRouAct = await destroyRoutineActivity(
        req.params.routineActivityId
      );

      console.log("made it to line 75 in rouActsRoute.delete");

      res.send(destroyedRouAct);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
