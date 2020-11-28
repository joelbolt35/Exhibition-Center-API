import express from "express";
import bunyan from "bunyan";
import LoginRouter from "./login";
import RegisterRouter from "./register";
import EventsRouter from "./events";
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

router.get("/logout", (req, res) => {
	const cookies = req.cookies as CookiesModel;
	if (cookies.userID && Object.keys(cookies.userID).length !== 0) {
		logger.info(cookies.userID, "'/logout' Clearing cookies. Fetching login page");
		res.clearCookie("userID");
	} else {
		logger.info("'/logout' Nobody was logged in. Fetching login page");
	}

	res.redirect("/");
});

export default router;
