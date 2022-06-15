import mongoose from 'mongoose';
const { Schema } = mongoose;

let obj = new Schema({
    seq: String,
    key: String,
    value: Number,
    date: Date
}, {
    collection: 'kv3',
    versionKey: false
});

export default mongoose.model('kv3', obj);