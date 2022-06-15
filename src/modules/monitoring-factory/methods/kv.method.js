import { Client } from "basic-ftp";
import pkg from "xlsx";
const { readFile, utils } = pkg;

import fs from "fs";
const fileSystem = fs.promises;

import Kv1Model from "../models/kv1.js";
import Kv1Records from "../models/kv1_records.js";

import Kv2Model from "../models/kv2.js";
import Kv2Records from "../models/kv2_records.js";

import Kv3Model from "../models/kv3.js";
import Kv3Records from "../models/kv3_records.js";

import Kv4Model from "../models/kv4.js";
import Kv4Records from "../models/kv4_records.js";

import Kv5Model from "../models/kv5.js";
import Kv5Records from "../models/kv5_records.js";

let methods = {};
let timer;
let colSt = 2;
let KV;
let directoriesName = ["log0", "log1", "log2", "log3", "log4"];

methods.interval = async() => {
    clearInterval(timer);

    timer = setInterval(async() => {
        const second = new Date().getSeconds();
        console.log(second);

        if (second % 5 == 0) {
            methods.kvFTP();
        }
        if (second % 15 == 0) {
            methods.readFile();
        }
        if (second % 30 == 0) {
            methods.reconstruct();
        }
    }, 1000);
};

methods.kvFTP = () => {
    let client = new Client();
    const accessOption = {
        host: "10.200.90.93", // host: "10.200.90.152",
        user: "KV", // user: "kydtsys_01@kyocera.co.th",
        password: "kyocera", // password: "adminktc01",
        secure: false, // secure: false
    };
    client.ftp.verbose = false; // true
    client
        .access(accessOption)
        .then(async(res) => {
            console.log(res);
            // await client.ensureDir(`/MMC/${directoriesName[0]}`);
            // await client.clearWorkingDir().then((res1) => {
            //     console.log(res1);
            //     client.close();
            // });
            for (let index = 0; index < directoriesName.length; index++) {
                const fileList = await client.list(`/MMC/${directoriesName[index]}`);
                console.log(fileList);
                if (fileList.length > 0) {
                    await client
                        .downloadTo(
                            `D:\\MonitoringFactoryCSV\\data\\${directoriesName[index]}.csv`,
                            `/MMC/${directoriesName[index]}/${fileList[0].name}`
                        )
                    await client.ensureDir(`/MMC/${directoriesName[index]}`);
                    await client.clearWorkingDir().then((res) => {
                        console.log(res);
                        client.close();
                    });
                }
            }
        })
        .catch((err) => {
            // console.log(err);
            client.close();

        });
};

methods.readFile = () => {
    fs.readdir(`D:\\MonitoringFactoryCSV\\data`, async(err, files) => {
        // console.log(files);
        for (let index = 0; index < files.length; index++) {
            const workBook = readFile(
                `D:\\MonitoringFactoryCSV\\data\\${files[index]}`
            );
            const sheet_name_list = workBook.SheetNames;
            const obj = utils.sheet_to_json(workBook.Sheets[sheet_name_list[0]]);
            const dateT =
                workBook.Sheets[sheet_name_list[0]][`B${obj.length + 1}`][`w`].split(
                    `/`
                );
            const timeT =
                workBook.Sheets[sheet_name_list[0]][`C${obj.length + 1}`][`v`].split(
                    `:`
                );
            let newDate = new Date(
                Number(`20${dateT[2]}`),
                Number(dateT[0]) - 1,
                Number(dateT[1]),
                Number(timeT[0]),
                Number(timeT[1]),
                Number(timeT[2])
            ).getTime();
            // console.log(newDate);
            switch (files[index]) {
                case "log0.csv":
                    KV = Kv1Model;
                    break;
                case "log1.csv":
                    KV = Kv2Model;
                    break;
                case "log2.csv":
                    KV = Kv3Model;
                    break;
                case "log3.csv":
                    KV = Kv4Model;
                    break;
                case "log4.csv":
                    KV = Kv5Model;
                    break;
            }
            let lastRecordDate;
            const lastRecord = await KV.findOne().sort({ date: -1 });
            // console.log(lastRecord);
            const column = await methods.columnLoop(obj);
            if (lastRecord) {
                lastRecordDate = new Date(lastRecord.date).getTime();
                if (lastRecordDate < newDate) {
                    methods.insert(column, obj, newDate, files[index]);
                }
            } else {
                methods.insert(column, obj, newDate, files[index]);
            }
        }
    });
    // console.log(temp);
};

methods.columnLoop = async(obj) => {
    let i = 2;
    for (let loop = 0; loop < 100; loop++) {
        if (obj[0]["__EMPTY_" + i]) {
            i++;
        }
    }
    return i - 2;
};

methods.insert = async(column, obj, newDate, file) => {
    const newColumn = Array.from(Array(column).keys());
    const resultMap = newColumn.map((col, index) => {
        const temp = {
            seq: index,
            key: obj[0]["__EMPTY_" + (index + colSt)] || 0,
            value: obj[obj.length - 1] ?
                Number(obj[obj.length - 1]["__EMPTY_" + (index + colSt)]) : 0,
            date: newDate,
        };
        return temp;
    });

    KV.insertMany(resultMap, (err, rs) => {
        if (err) {
            console.log(err);
        } else if (rs) {
            fs.rm(`D:\\MonitoringFactoryCSV\\data\\${file}`, (err) => {
                if (err) console.log(err);
            });
            // return
        }
    });
};

methods.reconstruct = async() => {
    for (let index = 0; index < directoriesName.length; index++) {
        let KvRecords;
        switch (directoriesName[index]) {
            case "log0":
                KV = Kv1Model;
                KvRecords = Kv1Records;
                break;
            case "log1":
                KV = Kv2Model;
                KvRecords = Kv2Records;
                break;
            case "log2":
                KV = Kv3Model;
                KvRecords = Kv3Records;
                break;
            case "log3":
                KV = Kv4Model;
                KvRecords = Kv4Records;
                break;
            case "log4":
                KV = Kv5Model;
                KvRecords = Kv5Records;
                break;
        }
        const f_kv = await KV.findOne({}, (err) => {
            if (err) return handleError(err);
        }).sort({ date: 1 });

        if (f_kv) {
            const f_kv_date = new Date(f_kv["date"]).getTime();
            const standard = new Date().getTime() - 1000 * 3600 * 24 * 1;
            if (f_kv_date < standard) {
                const f_last_dt = await KV.find({ date: f_kv_date }, (err) => {
                    if (err) return handleError(err);
                });

                let count = await KvRecords.countDocuments();
                let obj = {};
                const len = f_last_dt.length;
                obj["seq"] = count += 1;
                for (let i = 0; i < len; i++) {
                    if (i == 0) obj["date"] = f_last_dt[i]["date"];
                    obj[f_last_dt[i]["key"]] = f_last_dt[i]["value"];
                }

                const c = await KvRecords.create(obj);
                if (c) {
                    await KV.deleteMany({ date: f_kv_date }, (err) => {
                        if (err) return handleError(err);
                    });
                }
            }
        }
    }
};
export default methods;