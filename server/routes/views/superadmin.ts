import express from "express";
import bunyan from "bunyan";
import { EventModel, EventUserModel, UserModel } from "../../models";
import { db } from "../../db";

const logger = bunyan.createLogger({ name: "views/events" });
const router: express.Router = express.Router();
const currPath = "/superadmin";
const viewPath = "pages/superadmin";

router.get("/", async (req, res) => {
	const user = res.locals.user as UserModel;
	if (!user || user.rank !== 2) return res.send("You are not a superadmin!");

	// Get events and render them
	logger.info(`GET ${currPath}`);
	let users = await db.run("SELECT * FROM Users") as UserModel[];
	const events = await db.run("SELECT * FROM Event") as EventModel[];
	const eventUsers = await db.run("SELECT * FROM EventUsers") as EventUserModel[];
	
	let filtering = false;
	if (req.query.filterby !== undefined) {
		const filterBy = req.query.filterby?.toString();
		switch (filterBy) {
			case "user": {
				filtering = true;
				users = users.filter(function (user) {
					return user.username.toLocaleLowerCase() === req.query.user?.toString().toLocaleLowerCase();
				});
				break;
			}
		}
	}


	// Loop through all the users to see what events they created or participated in.
	for (const user of users) {
		user.created = events.filter(e => e.created_by === user.id);
		const eventsIds = new Set(eventUsers.filter(e => e.user_ID === user.id).map(e => e.event_ID));
		user.participating = events.filter(e => eventsIds.has(e.id));
	}

	res.render(viewPath, {
		users,
		filtering
	});
});

export default router;
