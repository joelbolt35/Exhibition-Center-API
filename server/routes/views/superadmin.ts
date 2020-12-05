import express from "express";
import bunyan from "bunyan";
import {EventModel, EventUserModel, UserModel} from "@models";
import { db } from "@database";
import {OkPacket} from "mysql";

const logger = bunyan.createLogger({ name: "views/events" });
const router: express.Router = express.Router();
const currPath = "/superadmin";
const viewPath = "pages/superadmin";

router.get("/", async (req, res) => {
    const user = res.locals.user as UserModel;
    if (!user || user.rank !== 2) return res.send("You are not a superadmin!")

    // Get events and render them
    logger.info(`GET ${currPath}`);
    const users = await db.run("SELECT * FROM Users") as UserModel[];
    const events = await db.run("SELECT * FROM Event") as EventModel[];
    const eventUsers = await db.run("SELECT * FROM EventUsers") as EventUserModel[];

    // Loop through all the users to see what events they created or participated in.
    for (let user of users) {
        user.created = events.filter(e => e.created_by === user.id);
        const eventsIds = new Set(eventUsers.filter(e => e.user_ID === user.id).map(e => e.event_ID));
        user.participating = events.filter(e => eventsIds.has(e.id));
    }

    res.render(viewPath, {
        users
    });
});

export default router;
