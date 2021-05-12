const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const database_name = path.resolve(
  process.cwd(),
  "src",
  "sqlitedb/database.database"
);
const database = new sqlite3.Database(database_name, (err) => {
  if (err) {
    return console.error(err.message);
  }

  console.log("Successful connection to the database 'database.database'");

  database.run(
    `CREATE TABLE IF NOT EXISTS animals (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name text,
          description text,
          isEndangered boolean,
          image text,
          place_id ,
          FOREIGN KEY(place_id) REFERENCES places(id)
          ON DELETE CASCADE
          )`,
    (err) => {
      if (err) {
        // Table already created
        console.log("animal table created");
      }
    }
  );

  database.run(
    ` CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          email text UNIQUE,
          password text,
          created_at text DEFAULT CURRENT_TIMESTAMP ,
          CONSTRAINT email_unique UNIQUE (email)

          )`,
    (err) => {
      if (err) {
        // Table already created
        console.log("User table created successfully");
      }
    }
  );

  database.run(
    `CREATE TABLE IF NOT EXISTS places (
      id INTEGER primary key AUTOINCREMENT,
      place text UNIQUE,
      CONSTRAINT place_unique UNIQUE (place)

      )`,
    (err) => {
      if (err) {
        console.log("places table create");
      }
    }
  );
});

module.exports = database;
