import { Request, Response } from "express";
import { do_calc } from "./calc";
import { check_req_input } from "./validate";
import { Some } from "./types";

const express = require("express");

const PORT = 3000;

const err_send = (res: Response, msg: Some<object | string>) =>
    res.status(400)
        .send(!msg ? "Bad Request!" : typeof msg === "string" ? { error: msg } : msg);

export const api = () => {
    const app = express();
    app.use(express.json());

    app.post('/calc', (req: Request, res: Response) => {
        const move_name = req?.body?.move_name && typeof req?.body?.move_name === "string" ? req.body.move_name : { error: "no move name given!" };
        if (typeof move_name === "object") {
            return err_send(res, move_name);
        }
        const attacker = check_req_input(req?.body?.attacker);
        if (typeof attacker === "string" || !attacker) {
            return err_send(res, attacker);
        }
        const defender = check_req_input(req?.body?.defender, true);
        if (typeof defender === "string") {
            return err_send(res, defender);
        }
        const results = do_calc({
            move_name,
            attacker,
            defender
        });
        if (typeof results === "string") {
            return err_send(res, results);
        }
        res
            .status(200)
            .contentType("text/plain")
            .send(`${ results.damage }`);
    });

    app.listen(PORT, () => {
        console.log(`Listening at http://0.0.0.0:${ PORT }`);
    });
};


if (require.main === module) {
    api();
}
