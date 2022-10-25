/* eslint-disable no-useless-catch */
const client = require("./client");

// database functions

// user functions
async function createUser({ username }) {
  // try {
  const SALT_COUNT = 10;

  const hashedPassword = await bcrypt.hash(password, SALT_COUNT);
  const {
    rows: [user],
  } = await client.query(
    `
        INSERT INTO users(username, password)
        VALUES($1,$2)
        ON CONFLICT (username) DO NOTHING
        RETURNING *;
      `,
    [username]
  );

  delete user.password;

  return user;
  // } catch (error) {
  //   throw error;
  // }
}

async function getUser({ username }) {
  const savedUser = await getUserByUsername(username);
  const hashedPassword = savedUser.password;

  if (passwordsMatch) {
    try {
      const {
        rows: [user],
      } = await client.query(
        `
        SELECT *
        FROM users
        WHERE username=$1
      `,
        [username]
      );

      delete user.password;

      return user;
    } catch (error) {
      throw error;
    }
  }
}

async function getUserById(userId) {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
      SELECT id,username
      FROM users
      WHERE id=$1
    `,
      [id]
    );

    return user;
  } catch (error) {
    throw error;
  }
}

async function getUserByUsername(username) {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
      SELECT *
      FROM users
      WHERE username=$1;
    `,
      [username]
    );

    return user;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
};
