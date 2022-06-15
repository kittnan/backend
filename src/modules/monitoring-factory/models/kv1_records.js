import mongoose from 'mongoose';
const { Schema } = mongoose;

let obj = new Schema({
   date: Date
},{ 
   strict: false, 
   collection: 'kv1_records',
   versionKey: false 
});

export default mongoose.model('kv1_records', obj);