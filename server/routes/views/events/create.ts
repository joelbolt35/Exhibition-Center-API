import express from "express";
import bunyan from "bunyan";
import { EventModel, UserModel } from "@models";
import { db } from "@database";
import { OkPacket } from "mysql";

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
	const event = req.body as EventModel;
	const User = res.locals.user as UserModel;
	logger.info(req.body, `POST ${currPath}`);
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
