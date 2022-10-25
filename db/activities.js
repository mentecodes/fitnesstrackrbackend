/* eslint-disable no-useless-catch */
const client = require("./client");

// database functions
async function getAllActivities() {
  try {
    const { rows: allActivities } = await client.query(`
        SELECT *
        FROM activities
    `);

    return allActivities;
  } catch (error) {
    throw error;
  }
}

async function getActivityById(id) {
  try {
    const {
      rows: [activity],
    } = await client.query(
      `
        SELECT *
        FROM activities
        WHERE id=$1;
      `,
      [id]
    );

    return activity;
  } catch (error) {
    throw error;
  }
}

async function getActivityByName(name) {}

// select and return an array of all activities
async function attachActivitiesToRoutines(routines) {}

// return the new activity
async function createActivity({ name, description }) {
  try {
    const {
      rows: [activity],
    } = await client.query(
      `
        INSERT INTO activities(name,description)
        VAlUES($1,$2)
        RETURNING *;
      `,
      [name, description]
    );

    return activity;
  } catch (error) {
    throw error;
  }
}

// don't try to update the id
// do update the name and description
// return the updated activity
async function updateActivity({ id, ...fields }) {
  try {
    const {
      rows: [activity],
    } = await client.query(
      `
        UPDATE activities
        SET name=$1,description=$2
        WHERE id=$3
        RETURNING *;
      `,
      [name, description, id]
    );

    return activity;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getAllActivities,
  getActivityById,
  getActivityByName,
  attachActivitiesToRoutines,
  createActivity,
  updateActivity,
};
