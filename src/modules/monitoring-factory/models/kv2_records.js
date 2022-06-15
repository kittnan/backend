import mongoose from 'mongoose';
const { Schema } = mongoose;

let obj = new Schema({
    date: Date
}, {
    strict: false,
    collection: 'kv2_records',
    versionKey: false
});

export default mongoose.model('kv2_records', obj);