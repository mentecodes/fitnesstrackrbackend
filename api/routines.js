const express = require("express");
const router = express.Router();

const {
  getAllPublicRoutines,
  createRoutine,
  updateRoutine,
  destroyRoutine,
  getRoutineActivitiesByRoutine,
  destroyRoutineActivity,
  addActivityToRoutine,
} = require("../db");
// const jwt = require("jsonwebtoken");
const authorizeUser = require("./utils");

// GET /api/routines

router.get("/", async (req, res, next) => {
  try {
    const routines = await getAllPublicRoutines();

    res.send(routines);
  } catch (error) {
    next(error);
  }
});

// POST /api/routines
router.post("/", authorizeUser, async (req, res, next) => {
  try {
    const { isPublic, name, goal } = req.body;

    const routine = await createRoutine({
      creatorId: req.user.id,
      isPublic,
      name,
      goal,
    });

    res.send(routine);
  } catch (error) {
    next(error);
  }
});

// PATCH /api/routines/:routineId

router.patch("/:routineId", async (req, res, next) => {
  try {
    const { isPublic, name, goal } = req.body;

    const routine = await updateRoutine({
      id: req.params.routineId,
      isPublic,
      name,
      goal,
    });

    res.send(routine);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/routines/:routineId

router.delete("/:routineId", authorizeUser, async (req, res, next) => {
  try {
    const routineActivitiesToDelete = await getRoutineActivitiesByRoutine({
      routineId: req.params.routineId,
    });

    for (let i = 0; i < routineActivitiesToDelete.length; i++) {
      await destroyRoutineActivity(routineActivitiesToDelete[i].id);
    }

    const deletedRoutine = await destroyRoutine(req.params.routineId);

    res.send(deletedRoutine);
  } catch (error) {
    next(error);
  }
});

// POST /api/routines/:routineId/activities

router.post("/:routineId/activities", async (req, res, next) => {
  // console.log("made it to line 96 inside routinesRouter.post");
  try {
    // console.log("made it to line 98 in routinesRouter.post");
    const { activityId, count, duration } = req.body;
    // console.log(
    //   "activityId, count, and duration from inside routinesRouter.post:",
    //   activityId,
    //   count,
    //   duration
    // );

    const activity = await addActivityToRoutine({
      routineId: req.params.routineId,
      activityId,
      count,
      duration,
    });

    // console.log("you made it to line 114 in routinesRouter.post");
    // console.log("activity:", activity);

    res.send(activity);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
