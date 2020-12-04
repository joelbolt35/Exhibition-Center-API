import express from "express";
import bunyan from "bunyan";
import { CookiesModel, EventModel, UserModel } from "@models";
import CreateEvent from "./events/create";
import { db } from "@database";

const logger = bunyan.createLogger({ name: "views/events" });
const router: express.Router = express.Router();
const currPath = "/events";
const viewPath = "pages/events";

router.use("/create", CreateEvent);

router.get("/", async (req, res) => {
	// const user = res.locals.user as UserModel;
	// Get events and render them
	logger.info(`GET ${currPath}`);
	const query = "SELECT * FROM Event";
	const events = await db.run(query) as { results: EventModel[] };

	res.render(viewPath, {
		events,
	});
});

export default router;
