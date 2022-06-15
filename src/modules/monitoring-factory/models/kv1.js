import mongoose from 'mongoose';
const { Schema } = mongoose;

let obj = new Schema({
    seq: String,
    key: String,
    value: Number,
    date: Date
},{
    collection: 'kv1',
    versionKey: false
});

export default mongoose.model('kv1', obj);