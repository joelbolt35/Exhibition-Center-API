import express from "express";
import bunyan from "bunyan";
import { EventModel, UserModel } from "@models";
import { db } from "@database";
import { OkPacket } from "mysql";

const logger = bunyan.createLogger({ name: "views/events" });
const router: express.Router = express.Router();

router.get("/", async (req, res) => {
	// Get events and render them

	let query = "";
	const User = res.locals.user as UserModel;

	// If super admin or participant, list all events
	if (User.rank === 3 || User.rank === 1)
		query = "SELECT * FROM Event";

	// If admin, list events created by them.
	else if (User.rank === 2)
		query = "SELECT * FROM Event WHERE created_by = ?";

	const events = await db.run(query, [User.id]) as { results: EventModel[] };
	// logger.info(events);

	res.render("pages/events.ejs", {
		events,
	});
});


router.get("/create", (_req, res) => {
	res.render("pages/create-event.ejs");
});

router.post("/create", async (req, res) => {
	const body = req.body as EventModel;
	const User = res.locals.user as UserModel;

	const ok = await db.run(
		"INSERT INTO Event (created_by, name, description, start, end, url, address) " +
		"VALUES (?, ?, ?, ?, ?, ?, ?)",
		[User.id, body.name, body.description, body.start, body.end, body.url, body.address]) as OkPacket;

	logger.info(`POST /events/create - Event created with ID: ${ok.insertId}`);

	res.redirect("/");
});

export default router;
