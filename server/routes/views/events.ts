import express from "express";
import bunyan from "bunyan";
import moment from "moment";
import CreateEvent from "./events/create";
import { OkPacket } from "mysql";
import { EventModel, EventUserModel, UserModel } from "../../models";
import { db } from "../../db";

const logger = bunyan.createLogger({ name: "views/events" });
const router: express.Router = express.Router();
const currPath = "/events";
const viewPath = "pages/events";

router.use("/create", CreateEvent);

router.get("/", async (req, res) => {
	const user = res.locals.user as UserModel;
	const requestQueries = req.query as {
		filterby?: string,
		city?: string,
		start?: string,
		end?: string,
	};
	// Get events and render them
	logger.info(`GET ${currPath}`);

	// Query Events from DB
	const query = "SELECT * FROM Event";
	let events = await db.run(query) as EventModel[];

	// Query Params
	const cityQuery = requestQueries.city || "";
	let startDateQuery = requestQueries.start || "";
	let endDateQuery = requestQueries.end || "";
	startDateQuery = startDateQuery.split("/").join("-");
	endDateQuery = endDateQuery.split("/").join("-");

	let filtering = false;
	if (requestQueries.filterby) {
		const filterBy = requestQueries.filterby;
		filtering = true;
		switch (filterBy) {
			case "owned": {
				events = events.filter((event) =>
					event.created_by === user.id
				);
				break;
			}
			case "currentactive": {
				const today = moment();
				events = events.filter((event) =>
					event.created_by === user.id &&
					moment(event.start).isSameOrBefore(today, "day") &&
					moment(today).isSameOrBefore(event.end, "day")
				);
				break;
			}
			case "city": {
				if (cityQuery) {
					events = events.filter((event) =>
						event.city.toLocaleLowerCase() === cityQuery.toLocaleLowerCase()
					);
				}
				if (startDateQuery)
					events = events.filter((event) =>
						moment(startDateQuery).isSameOrBefore(event.start, "day")
					);
				if (endDateQuery)
					events = events.filter((event) =>
						moment(event.end).isSameOrBefore(endDateQuery, "day")
					);
				break;
			}
		}
	}

	// If the user is logged in, get all the events they are registered for and see if they are registered for each event.
	if (user) {
		// Make a set of all event IDs this user is registered for.
		const registered = new Set(((await db.run("SELECT * FROM EventUsers WHERE user_ID = ?", [
			user.id,
		])) as EventUserModel[]).map(eu => eu.event_ID));

		for (const event of events) {
			event.registered = registered.has(event.id);
		}
	}

	res.render(viewPath, {
		events,
		filtering,
		cityQuery,
		startDateQuery,
		endDateQuery
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

	res.redirect(`/events/${eventID}`);
});

export default router;
