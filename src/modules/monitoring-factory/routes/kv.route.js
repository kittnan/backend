import { Router } from 'express';
const routes = Router();

import Kv1Model from '../models/kv1.js';
import Kv2Model from '../models/kv2.js';
import Kv3Model from '../models/kv3.js';
import Kv4Model from '../models/kv4.js';
import Kv5Model from '../models/kv5.js';

routes.route('/count').get(async(req, res) => {
    const count = await Kv1Model.countDocuments({}, (err) => {
        if (err) {
            console.error(err);
            return;
        }
    });
    res.json(count);
});

routes.route('/post/get-data').post((req, res) => {
    let KV;
    switch (req.body.kv) {
        case "kv1":
            KV = Kv1Model;
            break;
        case "kv2":
            KV = Kv2Model;
            break;
        case "kv3":
            KV = Kv3Model;
            break;
        case "kv4":
            KV = Kv4Model;
            break;
        case "kv5":
            KV = Kv5Model;
            break;
    }

    const obj = req.body.obj;
    const limit = req.body.limit;
    if (limit) {
        KV.find(obj, (err, kv1ObjRes) => {
            if (err)
                console.error(err);
            else
                res.json(kv1ObjRes);
        }).sort({ date: -1, key: 1 }).limit(limit);
    } else {
        KV.find(obj, (err, kv1ObjRes) => {
            if (err)
                console.error(err);
            else
                res.json(kv1ObjRes);
        }).sort({ date: -1, key: 1 });
    }
});

// Defined delete | remove | destroy route
routes.route('/put/delete-many').put((req, res) => {
    let KV;
    switch (req.body.kv) {
        case "kv1":
            KV = Kv1Model;
            break;
        case "kv2":
            KV = Kv2Model;
            break;
        case "kv3":
            KV = Kv3Model;
            break;
        case "kv4":
            KV = Kv4Model;
            break;
        case "kv5":
            KV = Kv5Model;
            break;
    }

    KV.deleteMany(req.body.obj, null, (err, kv1ObjRes) => {
        if (err)
            console.error(err);
        else
            res.json(kv1ObjRes);
    });
});

export default routes;