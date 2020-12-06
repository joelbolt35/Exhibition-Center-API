import express from "express";
import bunyan from "bunyan";
import crypto from "crypto";
import { AuthModel, UserModel } from "@models";
import { db } from "@database";
import bcrypt from "bcrypt";
import {OkPacket} from "mysql";

const logger = bunyan.createLogger({ name: "views/login" });
const router: express.Router = express.Router();
const currPath = "/login";
const viewPath = "pages/login";

router.get("/", (_req, res) => {
	logger.info(`'${currPath}' Fetching ${viewPath}`);
	res.render(viewPath);
});

router.post("/", async (req, res) => {
	const body = req.body as AuthModel;
	logger.info(body, `POST ${currPath}`);
	if (!body.username) {
		logger.info(`POST ${currPath} - Missing Username`);
		return res.render(viewPath, {
			error: "Missing Username",
			...body
		});
	}
	if (!body.password) {
		logger.info(`POST ${currPath} - Missing Password`);
		return res.render(viewPath, {
			error: "Missing Password",
			...body
		});
	}

	// Get the user that they are trying to login as:
	const potentialUsers = await db.run("SELECT * FROM Users WHERE username = ?", [body.username]) as [UserModel];
	if (potentialUsers.length !== 1) {
		logger.info(`POST ${currPath} - User Not Found`);
		return res.render(viewPath, {
			error: "Username doesn't exist",
			...body
		});
	}

	const potentialUser = potentialUsers[0];
	const correctPassword = await bcrypt.compare(body.password, potentialUser.password);

	// If password doesn't match
	if (!correctPassword) {
		logger.info(`POST ${currPath} - Incorrect Password`);
		return res.render(viewPath, {
			error: "Incorrect password",
			...body
		});
	}

	// Log the user in otherwise
	// Create a cryptographically secure string to use as a session ID, and store it in the database.
	var sessionId = crypto.randomBytes(24).toString('base64'); // 32 characters
	await db.run("INSERT INTO Sessions (session_id, user_id) VALUES (?, ?)", [sessionId, potentialUser.id]) as OkPacket;

	res.cookie("dbproj_sess", sessionId);

	logger.info(`POST ${currPath} - Success. Redirect '/'`);
	return res.redirect("/");
});

export default router;
