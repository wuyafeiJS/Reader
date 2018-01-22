import mongoose from 'mongoose'

const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const Novel = new mongoose.Schema({
  type: { type: String, default: 'Normal' },
  name: { type: String , unique: true},
  url: { type: String },
  status: { type: Number },
  author: { type: String },
  introduction: { type: String },
  img: { type: String, default: '' },
  updateTime: { type: String },
  lastChapterTitle: { type: String },
  countChapter: { type: Number },
})


export default mongoose.model('novel', Novel)
