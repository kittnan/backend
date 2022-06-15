import mongoose from 'mongoose';
const { Schema } = mongoose;

let obj = new Schema({
    password: String
},{
    collection: 'password',
    versionKey: false
});

export default mongoose.model('password', obj);