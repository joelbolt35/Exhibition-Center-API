import express from "express";
import bunyan from "bunyan";
import { EventModel, UserModel } from "@models";
import { db } from "@database";
import bcrypt from "bcrypt";
import {OkPacket} from "mysql";

const logger = bunyan.createLogger({ name: "views/events" });
const router: express.Router = express.Router();

router.get("/create", (_req, res) => {
    res.render("pages/create-event.ejs");
});

router.post("/create", async (req, res) => {
    const body = req.body as EventModel;
    const user = res.locals.user;


    const ok = await db.run("INSERT INTO Event (created_by, name, description, start, end, url, address) " +
        "VALUES (?, ?, ?, ?, ?, ?, ?)", [user.id, body.name, body.description, body.start, body.end, body.url, body.address]) as OkPacket;

    logger.info(`POST /events/create - Event created with ID: ${ok.insertId}`);

    res.redirect("/");
});

export default router;
