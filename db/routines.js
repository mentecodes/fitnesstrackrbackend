/* eslint-disable no-useless-catch */
const client = require("./client");

async function getRoutineById(id) {
  try {
    const {
      rows: [routine],
    } = await client.query(
      `
            SELECT *
            FROM routines
            WHERE id=$1
        `,
      [id]
    );

    return routine;
  } catch (error) {
    throw error;
  }
}

async function getRoutinesWithoutActivities() {
  try {
    const { rows: allRoutines } = await client.query(`
        SELECT * FROM routines
      `);

    return allRoutines;
  } catch (error) {
    throw error;
  }
}

async function getAllRoutines() {
  try {
    const { rows: allRoutines } = await client.query(`
        SELECT 
          routines.*, 
          users.username AS "creatorName", 
          JSON_AGG(
            JSON_BUILD_OBJECT(
              'id',activities.id,
              'routineActivityId',rouActs.id,
              'name',activities.name,
              'description',activities.description,
              'count',rouActs.count,
              'duration',rouActs.duration
            )
          ) AS activities 
        FROM routines
        INNER JOIN routine_activities AS rouActs ON rouActs."routineId" = routines.id
        INNER JOIN activities ON rouActs."activityId" = activities.id
        INNER JOIN users ON routines."creatorId" = users.id
        GROUP BY routines.id, users.username;
      `);

    return allRoutines;
  } catch (error) {
    throw error;
  }
}

async function getAllRoutinesByUser({ username }) {
  try {
    const { rows: allRoutines } = await client.query(
      `
        SELECT 
          routines.*, 
          users.username AS "creatorName", 
          JSON_AGG(
            JSON_BUILD_OBJECT(
              'id',activities.id,
              'routineActivityId',rouActs.id,
              'name',activities.name,
              'description',activities.description,
              'count',rouActs.count,
              'duration',rouActs.duration
            )
          ) AS activities 
        FROM routines
        LEFT JOIN routine_activities AS rouActs ON rouActs."routineId" = routines.id
        LEFT JOIN activities ON rouActs."activityId" = activities.id
        LEFT JOIN users ON routines."creatorId" = users.id
        WHERE users.username = $1
        GROUP BY routines.id, users.username;
      `,
      [username]
    );

    return allRoutines;
  } catch (error) {
    throw error;
  }
}

async function getPublicRoutinesByUser({ username }) {
  try {
    const routines = await getAllRoutinesByUser({ username });
    // console.log({ routines });

    const filteredRoutines = routines.filter((rou) => {
      if (rou.isPublic === true) {
        return rou;
      }
    });

    return filteredRoutines;
  } catch (error) {
    throw error;
  }
}

async function getAllPublicRoutines() {
  try {
    const { rows: allRoutines } = await client.query(`
        SELECT 
          routines.*, 
          users.username AS "creatorName", 
          JSON_AGG(
            JSON_BUILD_OBJECT(
              'id',activities.id,
              'routineActivityId',rouActs.id,
              'name',activities.name,
              'description',activities.description,
              'count',rouActs.count,
              'duration',rouActs.duration
            )
          ) AS activities 
        FROM routines
        LEFT JOIN routine_activities AS rouActs ON rouActs."routineId" = routines.id
        LEFT JOIN activities ON rouActs."activityId" = activities.id
        LEFT JOIN users ON routines."creatorId" = users.id
        WHERE routines."isPublic" = true
        GROUP BY routines.id, users.username;
      `);

    return allRoutines;
  } catch (error) {
    throw error;
  }
}

async function getPublicRoutinesByActivity({ id }) {
  try {
    const { rows: allRoutines } = await client.query(
      `
        SELECT 
          routines.*, 
          users.username AS "creatorName", 
          JSON_AGG(
            JSON_BUILD_OBJECT(
              'id',activities.id,
              'routineActivityId',rouActs.id,
              'name',activities.name,
              'description',activities.description,
              'count',rouActs.count,
              'duration',rouActs.duration
            )
          ) AS activities 
        FROM routines
        INNER JOIN routine_activities AS rouActs ON rouActs."routineId" = routines.id
        INNER JOIN activities ON rouActs."activityId" = activities.id
        INNER JOIN users ON routines."creatorId" = users.id
        WHERE activities.id = $1
        GROUP BY routines.id, users.username;
      `,
      [id]
    );

    return allRoutines;
  } catch (error) {
    throw error;
  }
}

async function createRoutine({ creatorId, isPublic, name, goal }) {
  try {
    const {
      rows: [routine],
    } = await client.query(
      `
        INSERT INTO routines("creatorId", "isPublic", name, goal)
        VALUES ($1,$2,$3,$4)
        ON CONFLICT (name) DO NOTHING
        RETURNING *;
    `,
      [creatorId, isPublic, name, goal]
    );

    //test file just wants id and name returned for this function
    return routine;
  } catch (error) {
    throw error;
  }
}

async function updateRoutine({ id, isPublic, name, goal }) {
  const fields = { isPublic, name, goal };
  for (const key in fields) {
    if (fields[key] === undefined) {
      delete fields[key];
    }
  }
  const setString = Object.keys(fields) // -> Object.keys(fields) returns an Array of keys as strings ['key1', 'key2', ...]
    .map((key, index) => `"${key}"=$${index + 2}`) // "key1" = $1, "key2" = $2; offset because $1 is reserved for id
    .join(", "); //conacates it into a string
  // console.log({ setString });
  try {
    const {
      rows: [routine],
    } = await client.query(
      `
            UPDATE routines
            SET ${setString}
            WHERE id=$1
            RETURNING *;
        `,
      [id, ...Object.values(fields)] // [ 1, false, 'legDay', 'goal string or somethin :)' ]
    );

    return routine;
  } catch (error) {
    throw error;
  }
}

async function destroyRoutine(id) {
  try {
    const {
      rows: [routine],
    } = await client.query(`DELETE FROM routines WHERE id=$1 RETURNING *`, [
      id,
    ]);

    return routine;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getRoutineById,
  getRoutinesWithoutActivities,
  getAllRoutines,
  getAllPublicRoutines,
  getAllRoutinesByUser,
  getPublicRoutinesByUser,
  getPublicRoutinesByActivity,
  createRoutine,
  updateRoutine,
  destroyRoutine,
};
