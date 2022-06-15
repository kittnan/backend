import mongoose from 'mongoose';
const { Schema } = mongoose;

let obj = new Schema({
    date: Date
}, {
    strict: false,
    collection: 'kv3_records',
    versionKey: false
});

export default mongoose.model('kv3_records', obj);