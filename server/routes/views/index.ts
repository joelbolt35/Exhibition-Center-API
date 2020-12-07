import express from "express";
import bunyan from "bunyan";
import LoginRouter from "./login";
import RegisterRouter from "./register";
import EventsRouter from "./events";
import myEventsRouter from "./myEvents";
import SuperAdminRouter from "./superadmin";
import { CookiesModel } from "@models";

const logger = bunyan.createLogger({ name: "views" });
const router: express.Router = express.Router();
const currPath = "/";
const viewPath = "pages/index";

router.get("/", (req, res) => {
	logger.info(`'${currPath}' Fetching ${viewPath}`);
	res.render(viewPath);
});

router.use("/login", LoginRouter);

router.use("/register", RegisterRouter);

router.use("/events", EventsRouter);

router.use("/myEvents", myEventsRouter);

router.use("/superadmin", SuperAdminRouter);

router.get("/logout", (req, res) => {
	res.clearCookie("dbproj_sess");
	res.redirect("/");
});

export default router;
