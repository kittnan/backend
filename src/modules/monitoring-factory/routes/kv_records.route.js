import { Router } from "express";
const routes = Router();

// import methodsFunc from '../methods/kv1.method.js';
import Kv1RecordsModel from "../models/kv1_records.js";
import Kv2RecordsModel from "../models/kv2_records.js";
import Kv3RecordsModel from "../models/kv3_records.js";
import Kv4RecordsModel from "../models/kv4_records.js";
import Kv5RecordsModel from "../models/kv5_records.js";

routes.route("/count").post(async(req, res) => {
    let KV;
    switch (req.body.kv) {
        case "kv1":
            KV = Kv1RecordsModel;
            break;
        case "kv2":
            KV = Kv2RecordsModel;
            break;
        case "kv3":
            KV = Kv3RecordsModel;
            break;
        case "kv4":
            KV = Kv4RecordsModel;
            break;
        case "kv5":
            KV = Kv5RecordsModel;
            break;
    }

    await KV.countDocuments({}, (err, result) => {
        res.json(result);
    });
});

routes.route("/set/false").get((req, res) => {
    methodsFunc.setCount(-1);
    res.json(false);
});
routes.route("/set/true").get((req, res) => {
    methodsFunc.setCount(0);
    res.json(true);
});

routes.route("/query").post(async(req, res) => {
    let KV;
    switch (req.body.kv) {
        case "kv1":
            KV = Kv1RecordsModel;
            break;
        case "kv2":
            KV = Kv2RecordsModel;
            break;
        case "kv3":
            KV = Kv3RecordsModel;
            break;
        case "kv4":
            KV = Kv4RecordsModel;
            break;
        case "kv5":
            KV = Kv5RecordsModel;
            break;
    }

    const f = await KV.find(req.body.data, (err) => {
        if (err) {
            console.error(err);
            return;
        }
    });
    res.json(f);
});

routes.route("/delete").put(async(req, res) => {
    let KV;
    switch (req.body.kv) {
        case "kv1":
            KV = Kv1RecordsModel;
            break;
        case "kv2":
            KV = Kv2RecordsModel;
            break;
        case "kv3":
            KV = Kv3RecordsModel;
            break;
        case "kv4":
            KV = Kv4RecordsModel;
            break;
        case "kv5":
            KV = Kv5RecordsModel;
            break;
    }

    const d = await KV.deleteMany(req.body.data, (err) => {
        if (err) {
            console.error(err);
            return;
        }
    });
    res.json(d);
});

export default routes;