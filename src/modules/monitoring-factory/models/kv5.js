import mongoose from 'mongoose';
const { Schema } = mongoose;

let obj = new Schema({
    seq: String,
    key: String,
    value: Number,
    date: Date
}, {
    collection: 'kv5',
    versionKey: false
});

export default mongoose.model('kv5', obj);