import express from "express";
import bunyan from "bunyan";
import {EventModel, EventUserModel, UserModel} from "@models";
import CreateEvent from "./events/create";
import { db } from "@database";
import {OkPacket} from "mysql";

const logger = bunyan.createLogger({ name: "views/events" });
const router: express.Router = express.Router();
const currPath = "/events";
const viewPath = "pages/events";

router.use("/create", CreateEvent);

router.get("/", async (req, res) => {
	const user = res.locals.user as UserModel;
	// Get events and render them
	logger.info(`GET ${currPath}`);
	const query = "SELECT * FROM Event";
	const events = await db.run(query) as EventModel[];

	// If the user is logged in, get all the events they are registered for and see if they are registered for each event.
	if (user) {
		// Make a set of all event IDs this user is registered for.
		const registered = new Set(((await db.run("SELECT * FROM EventUsers WHERE user_ID = ?", [
			user.id,
		])) as EventUserModel[]).map(eu => eu.event_ID));

		for (let event of events) {
			event.registered = registered.has(event.id);
		}
	}

	res.render(viewPath, {
		events,
	});
});

router.get("/:eventID", async (req, res) => {
	const eventID = req.params.eventID;
	const user = res.locals.user as UserModel;

	// Get an event and render the event page.
	const query = "SELECT * FROM Event WHERE id = ?";
	const events = await db.run(query, [eventID]) as EventModel[];
	if (!events || events.length === 0)
		return res.send("Event not found");
	const event = events[0];

	let registered = false;
	if (user) {
		registered = ((await db.run("SELECT * FROM EventUsers WHERE user_ID = ? AND event_ID = ?", [
			user.id,
			eventID
		])) as EventUserModel[]).length === 1;
	}

	res.render("pages/events/event", {
		registered,
		event,
	});
});


router.post("/:eventID/register", async (req, res) => {
	const user = res.locals.user as UserModel;
	const eventID = req.params.eventID;
	if (!user)
		return res.redirect("/");

	const ok = await db.run("INSERT INTO EventUsers (user_ID, event_ID) VALUES (?, ?)", [user.id, eventID]) as OkPacket;

	logger.info(`GET ${user.id} registered for ${eventID}`);

	res.redirect(`/events/${eventID}`)
});

export default router;
