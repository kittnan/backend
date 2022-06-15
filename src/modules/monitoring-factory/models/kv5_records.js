import mongoose from 'mongoose';
const { Schema } = mongoose;

let obj = new Schema({
    date: Date
}, {
    strict: false,
    collection: 'kv5_records',
    versionKey: false
});

export default mongoose.model('kv5_records', obj);