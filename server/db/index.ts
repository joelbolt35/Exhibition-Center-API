import mysql from 'mysql';
import bunyan from 'bunyan';
require('dotenv').config();
const logger = bunyan.createLogger({name: 'db'});

logger.info("Opening MySQL DB connection to exhibition_center")
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
    const queryString = "SELECT * FROM potluck";
    logger.info(queryString);
    pool.query(queryString, (err, results) => {
      if (err) return reject(err);
      else return resolve(results);
    })
  })
}

export default potluckdb;