import mongoose from 'mongoose';
const { Schema } = mongoose;

let obj = new Schema({
    date: Date
}, {
    strict: false,
    collection: 'kv4_records',
    versionKey: false
});

export default mongoose.model('kv4_records', obj);