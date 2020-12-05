import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import "module-alias/register";
import apiRouter from "./routes/api";
import viewsRouter from "./routes/views";
import bunyan from "bunyan";
import { CookiesModel, UserModel } from "@models";
import { db } from "@database";

const logger = bunyan.createLogger({ name: "server" });
const app: express.Application = express();

// Enables express to read form values
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Enables express to read cookies
app.use(cookieParser());

// Set the view engine to ejs
app.set("view engine", "ejs");

// Setup the routes

// Get the current user and set the res.locals.user and res.user objects so that
// all routes and all templates have access to the current user.
app.all("*", async (req, res, next) => {
	const cookies = req.cookies as CookiesModel;

	res.locals.path = req.path;

	if (cookies.userID) {
		const result = await db.run("SELECT * FROM Users WHERE id = ?", [cookies.userID]) as [UserModel];
		if (result.length === 1) {
			res.locals.user = result[0];
		}
	}
	next();
});

app.use("/", viewsRouter);
app.use("/api", apiRouter);


// KEEP LAST
app.get("*", function(req, res) {
	res.redirect("/");
});
const PORT = process.env.PORT || 3000;

app.listen(PORT, function () {
	logger.info(`App is listening on port ${PORT}`);
});
