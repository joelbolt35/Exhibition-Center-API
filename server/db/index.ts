import mysql from 'mysql';
require('dotenv').config();

console.log("Opening MySQL DB connection to exhibition_center")
const pool = mysql.createPool({
  connectionLimit: 100,
  password: process.env.DB_PASS,
  user: process.env.DB_USER,
  database: "exhibition_center",
  host: process.env.DB_HOST,
  port: 3306,
});

interface AllDB { 
  all: () => Promise<any>;
}

let potluckdb = {} as AllDB;

potluckdb.all = () => {
  return new Promise((resolve, reject) => {
    console.log("potluck grabbing all data from the db");
    pool.query('SELECT * FROM potluck', (err, results) => {
      if (err) return reject(err);
      else return resolve(results);
    })
  })
}

export default potluckdb;