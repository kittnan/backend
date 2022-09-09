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
// let KV;
let directoriesName = ["log0", "log1", "log2", "log3", "log4"];
let directoryKV1 = "log0";
let directoryKV2 = "log1";
let directoryKV3 = "log2";
let directoryKV4 = "log3";
let directoryKV5 = "log4";
methods.interval = async() => {
    clearInterval(timer);

    timer = setInterval(async() => {
        const second = new Date().getSeconds();
        // console.log(second);

        if (second % 7 == 0) {
            methods.kvFTP();
        }
        if (second == 10) {
            methods.kv(Kv1Model, directoryKV1);
        }
        if (second == 20) {
            methods.kv(Kv2Model, directoryKV2);
        }
        if (second == 30) {
            methods.kv(Kv3Model, directoryKV3);
        }
        if (second == 40) {
            methods.kv(Kv4Model, directoryKV4);
        }
        if (second == 50) {
            methods.kv(Kv5Model, directoryKV5);
        }
        if (second == 15) {
            methods.reconstruct(Kv1Model, Kv1Records);
        }
        if (second == 25) {
            methods.reconstruct(Kv2Model, Kv2Records);
        }
        if (second == 35) {
            methods.reconstruct(Kv3Model, Kv3Records);
        }
        if (second == 45) {
            methods.reconstruct(Kv4Model, Kv4Records);
        }
        if (second == 55) {
            methods.reconstruct(Kv5Model, Kv5Records);
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
            // console.log(res);
            // await client.ensureDir(`/MMC/${directoriesName[0]}`);
            // await client.clearWorkingDir().then((res1) => {
            //     console.log(res1);
            //     client.close();
            // });
            for (let index = 0; index < directoriesName.length; index++) {
                const fileList = await client.list(`/MMC/${directoriesName[index]}`);
                // console.log(fileList);
                if (fileList.length > 0) {
                    console.log(directoriesName[index], fileList);

                    await client.downloadTo(
                        `D:\\MonitoringFactoryCSV\\data\\${directoriesName[index]}.csv`,
                        `/MMC/${directoriesName[index]}/${fileList[0].name}`
                    );
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

methods.kv = (KVModel, directory) => {
    fs.readdir(`D:\\MonitoringFactoryCSV\\data`, async(err, files) => {
        const file = files.find((file) =>
            file.toLocaleLowerCase().includes(directory)
        );
        if (file) {
            const workBook = readFile(`D:\\MonitoringFactoryCSV\\data\\${file}`);
            const sheet_name_list = workBook.SheetNames;
            const obj = utils.sheet_to_json(workBook.Sheets[sheet_name_list[0]]);
            const ws = workBook.Sheets[sheet_name_list[0]];
            if (ws["!ref"] != "A1" && obj.length > 0) {
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
                let lastRecordDate;
                const lastRecord = await KVModel.findOne().sort({ date: -1 });
                const column = await methods.columnLoop(obj);
                if (lastRecord) {
                    lastRecordDate = new Date(lastRecord.date).getTime();
                    if (lastRecordDate < newDate) {
                        console.log(KVModel);
                        console.log(file);
                        console.log(obj);
                        methods.insert(column, obj, newDate, file, KVModel);
                    }
                } else {
                    console.log(KVModel);
                    console.log(file);
                    console.log(obj);
                    methods.insert(column, obj, newDate, file, KVModel);
                }
            } else {
                fs.rm(`D:\\MonitoringFactoryCSV\\data\\${file}`, (err) => {
                    if (err) console.log(err);
                });
            }
        }
    });
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

methods.insert = async(column, obj, newDate, file, KVModel) => {
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

    KVModel.insertMany(resultMap, (err, rs) => {
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

methods.reconstruct = async(KVModel, KVRecord) => {
    const f_kv = await KVModel.findOne({}, (err) => {
        if (err) return handleError(err);
    }).sort({ date: 1 });

    if (f_kv) {
        const f_kv_date = new Date(f_kv["date"]).getTime();
        const standard = new Date().getTime() - 1000 * 3600 * 24 * 1;
        if (f_kv_date < standard) {
            const f_last_dt = await KVModel.find({ date: f_kv_date }, (err) => {
                if (err) return handleError(err);
            });

            let count = await KVRecord.countDocuments();
            let obj = {};
            const len = f_last_dt.length;
            obj["seq"] = count += 1;
            for (let i = 0; i < len; i++) {
                if (i == 0) obj["date"] = f_last_dt[i]["date"];
                obj[f_last_dt[i]["key"]] = f_last_dt[i]["value"];
            }

            const c = await KVRecord.create(obj);
            if (c) {
                await KVModel.deleteMany({ date: f_kv_date }, (err) => {
                    if (err) return handleError(err);
                });
            }
        }
    }
};
export default methods;