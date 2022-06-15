import mongoose from 'mongoose';
const { Schema } = mongoose;

let obj = new Schema({
    seq: String,
    key: String,
    value: Number,
    date: Date
}, {
    collection: 'kv4',
    versionKey: false
});

export default mongoose.model('kv4', obj);