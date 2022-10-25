/* eslint-disable no-useless-catch */
const client = require("./client");

async function getRoutineActivityById(id) {
  try {
    const {
      rows: [rouAct],
    } = await client.query(
      `
        SELECT *
        FROM routine_activities
        WHERE id=$1
    `,
      [id]
    );

    return rouAct;
  } catch (error) {
    throw error;
  }
}

async function addActivityToRoutine({
  routineId,
  activityId,
  count,
  duration,
}) {
  try {
    const {
      rows: [rouAct],
    } = await client.query(
      `
        INSERT INTO routine_activities("routineId","activityId",count,duration)
        VALUES($1,$2,$3,$4)
        RETURNING *
    `,
      [routineId, activityId, count, duration]
    );

    // console.log("you made it to line 49 in db function, addActivityToRoutine");

    return rouAct;
  } catch (error) {
    throw error;
  }
}

async function getRoutineActivitiesByRoutine({ id }) {
  try {
    const { rows: rouActs } = await client.query(
      `
        SELECT *
        FROM routine_activities
        WHERE "routineId" = $1
    `,
      [id]
    );

    return rouActs;
  } catch (error) {
    throw error;
  }
}

async function updateRoutineActivity({ id, count, duration }) {
  try {
    const {
      rows: [rouAct],
    } = await client.query(
      `
        UPDATE routine_activities
        SET count=$1,duration=$2
        WHERE id=$3
        RETURNING *
      `,
      [count, duration, id]
    );

    return rouAct;
  } catch (error) {
    throw error;
  }
}

async function destroyRoutineActivity(id) {
  console.log("made it inside db function, destroyRoutineActivity");

  try {
    const {
      rows: [deletedRouAct],
    } = await client.query(
      `
            DELETE FROM routine_activities 
            WHERE id=$1
            RETURNING *;
        `,
      [id]
    );

    console.log("made it to line 99 of db function, destroyRoutineActivity");

    return deletedRouAct;
  } catch (error) {
    throw error;
  }
}

async function canEditRoutineActivity(routineActivityId, userId) {}

module.exports = {
  getRoutineActivityById,
  addActivityToRoutine,
  getRoutineActivitiesByRoutine,
  updateRoutineActivity,
  destroyRoutineActivity,
  canEditRoutineActivity,
};
