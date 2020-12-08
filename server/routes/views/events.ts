import express from "express";
import bunyan from "bunyan";
import CreateEvent from "./events/create";
import {OkPacket} from "mysql";
import {EventModel, EventUserModel, UserModel} from "../../models";
import {db} from "../../db";

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
	let events = await db.run(query) as EventModel[];
	let filtering = false;

	if(req.query.filterby !== undefined)
	{
		const filterBy = req.query.filterby!.toString()
		switch (filterBy) {
			case "owned": {
				filtering = true;
				
				events = events.filter(function (event) {
					logger.info(event.created_by === res.locals.user.id);
					return event.created_by === res.locals.user.id
				})
				break;
			}
			case "currentactive": {
				filtering = true;
				
				const today = new Date()
				events = events.filter(function (event) {
					return event.created_by === res.locals.user.id && event.start <= today && today <= event.end
				})
				break;
			}
			case "city": {
				filtering = true;
				
				events = events.filter(function (event) {
					return event.city.toLocaleLowerCase() === req.query.city
				})
				break;
			}
			case "date": {
				filtering = true;

				if(req.query.start !== undefined && req.query.end !== undefined)
				{
					const start = new Date(req.query.start!.toString())
					const end = new Date(req.query.end!.toString())
					events = events.filter(function (event) {
						return start <= event.start && event.end <= end
					})
				}
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

		for (let event of events) {
			event.registered = registered.has(event.id);
		}
	}

	res.render(viewPath, {
		events,
		filtering
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
