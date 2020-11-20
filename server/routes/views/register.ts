import express from 'express';
import bunyan from 'bunyan';
import {AuthModel, PotluckModel, UserModel} from '../../models';
import db from "../../db";
const bcrypt = require('bcrypt');

const logger = bunyan.createLogger({name: 'views'});
const router: express.Router = express.Router();
const currPath = "/register";
const viewPath = "pages/register";

router.get('/', (_req, res) => {
    logger.info(`'${currPath}' Fetching ${viewPath}`);
    res.render(viewPath);
});

router.post('/', async (req, res) => {
    const body = req.body as AuthModel;
    logger.info(body, `POST ${currPath}`);

    if (!body.username) {
        logger.info(`POST ${currPath} - Missing Username`);
        return res.render(viewPath, {
            error: "Missing Username",
            ...body
        });
    }
    if (!body.password) {
        logger.info(`POST ${currPath} - Missing Password`);
        return res.render(viewPath, {
            error: "Missing Password",
            ...body
        });
    }

    // Check if user already exists
    const existingUsers = await db.run("SELECT COUNT(1) AS count FROM Users WHERE username = ?", [body.username]);
    console.log(existingUsers);
    if (existingUsers[0].count !== 0) {
        logger.info(`POST ${currPath} - User Exists`);
        return res.render(viewPath, {
            error: "Username is already taken",
            ...body
        });
    }

    // Hash password and create the user.
    const hash = await bcrypt.hash(body.password, 10);
    const ok = await db.run("INSERT INTO Users (username, password, rank) VALUES (?, ?, 1)", [body.username, hash]);
    logger.info(`POST ${currPath} - User Created with ID: ` + ok.insertId);

    res.cookie("user", ok.insertId);

    logger.info(`POST ${currPath} - Success. Redirect '/'`);
    return res.redirect("/");
});

export default router;
