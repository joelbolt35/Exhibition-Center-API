/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import mysql, { QueryOptions } from "mysql";
import bunyan from "bunyan";
import dotenv from "dotenv";

dotenv.config();
const logger = bunyan.createLogger({ name: "db" });

logger.info("Opening MySQL DB connection to exhibition_center");
const pool = mysql.createPool({
	connectionLimit: 100,
	password: process.env.DB_PASS,
	user: process.env.DB_USER,
	database: "exhibition_center",
	host: process.env.DB_HOST,
	port: 3306,
});

interface databaseInterface {
	all: () => Promise<any>,
	run: (query: QueryOptions["sql"], values?: QueryOptions["values"]) => Promise<any>
}

export const db: databaseInterface = {
	all: () => {
		return new Promise((resolve, reject) => {
			const queryString = "SELECT * FROM potluck";
			logger.info(queryString);
			pool.query(queryString, (err, results) => {
				if (err) return reject(err);
				else return resolve(results);
			});
		});
	},
	run: (query, values = []) => {
		logger.info(query);
		return new Promise<any>((resolve, reject) => {
			pool.query({
				sql: query,
				values
			}, (err, results) => {
				if (err) return reject(err);
				else return resolve(results);
			});
		});
	}
};
