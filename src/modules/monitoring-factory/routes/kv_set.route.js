import { Router } from 'express';
const routes = Router();

import Kv1SetModel from '../models/kv1_set.js';
import Kv2SetModel from '../models/kv2_set.js';
import Kv3SetModel from '../models/kv3_set.js';
import Kv4SetModel from '../models/kv4_set.js';
import Kv5SetModel from '../models/kv5_set.js';

routes.route('/post/get-data').post((req, res) => {
    let KV;
    switch (req.body.kv) {
        case "kv1":
            KV = Kv1SetModel;
            break;
        case "kv2":
            KV = Kv2SetModel;
            break;
        case "kv3":
            KV = Kv3SetModel;
            break;
        case "kv4":
            KV = Kv4SetModel;
            break;
        case "kv5":
            KV = Kv5SetModel;
            break;
    }
    KV.find(req.body.obj, (err, kv1ObjRes) => {
        if (err)
            console.error(err);
        else
            res.json(kv1ObjRes);
    }).limit(1);
});

routes.route('/put/update-data').put(async(req, res) => {
    let KV;
    switch (req.body.kv) {
        case "kv1":
            KV = Kv1SetModel;
            break;
        case "kv2":
            KV = Kv2SetModel;
            break;
        case "kv3":
            KV = Kv3SetModel;
            break;
        case "kv4":
            KV = Kv4SetModel;
            break;
        case "kv5":
            KV = Kv5SetModel;
            break;
    }
    const query = { key: req.body.key };
    const find = await KV.findOne(query);
    if (find) {
        req.body.date = new Date();
        KV.findOneAndUpdate({ _id: find._id }, { $set: req.body }, { upsert: true }, (err, doc) => {
            if (err)
                console.error(err);
            else
                res.json(doc);
        });
    } else {
        let insert = new KV(req.body.obj);
        insert.date = new Date();
        res.json(await KV.create(insert));
    }
});

routes.route('/put/delete').put((req, res) => {
    let KV;
    switch (req.body.kv) {
        case "kv1":
            KV = Kv1SetModel;
            break;
        case "kv2":
            KV = Kv2SetModel;
            break;
        case "kv3":
            KV = Kv3SetModel;
            break;
        case "kv4":
            KV = Kv4SetModel;
            break;
        case "kv5":
            KV = Kv5SetModel;
            break;
    }
    KV.deleteOne(req.body.data, {}, (err, kv1ObjRes) => {
        if (err)
            console.error(err);
        else
            res.json(kv1ObjRes);
    });
});

export default routes;