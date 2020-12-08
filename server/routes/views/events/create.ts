import express from "express";
import bunyan from "bunyan";
import moment from "moment";
import { OkPacket } from "mysql";
import { cleanEvent, EventModel, UserModel } from "../../../models";
import { db } from "../../../db";

const logger = bunyan.createLogger({ name: "views/events/create" });
const router: express.Router = express.Router();
const currPath = "/events/create";
const viewPath = "pages/events/create";

router.get("/", (_req, res) => {
	const user = res.locals.user as UserModel;
	if (!user)
		return res.redirect("/");
	logger.info(`GET ${currPath}`);
	res.render(viewPath);
});

router.post("/", async (req, res) => {
	const event = cleanEvent(req.body);
	const User = res.locals.user as UserModel;
	logger.info(`POST ${currPath}`);

	const overlappedAddresses = await db.run("SELECT * FROM Event WHERE address=? AND address2=? AND city=? AND state=? AND zipCode=?", [
		event.address,
		event.address2,
		event.city,
		event.state,
		event.zipCode,
	]) as EventModel[];

	let errorMessage = "";
	if (moment(event.end).isBefore(event.start, "day")) {
		errorMessage = "End Date is before Start Date";
	}
	if (errorMessage === "") {
		for (let i = 0; i < overlappedAddresses.length; i++) {
			const endBefore = moment(overlappedAddresses[i].end).isBefore(event.start, "day");
			const startAfter = moment(event.end).isBefore(overlappedAddresses[i].start, "day");
			if (!endBefore && !startAfter) {
				errorMessage = `Overlap with the existing event: ${overlappedAddresses[i].name}`;
			}
		}
	}
	if (errorMessage !== "") {
		logger.info(errorMessage);
		return res.render(viewPath, {
			error: errorMessage,
			...event
		});
	}

	const ok = await db.run(
		"INSERT INTO Event (created_by, name, description, start, end, url, address, address2, city, state, zipCode) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)",
		[
			User.id,
			event.name,
			event.description,
			event.start,
			event.end,
			event.url,
			event.address,
			event.address2,
			event.city,
			event.state,
			event.zipCode
		]) as OkPacket;

	logger.info(`POST ${currPath} - Event created with ID: ${ok.insertId}`);

	res.redirect("/events");
});

export default router;
