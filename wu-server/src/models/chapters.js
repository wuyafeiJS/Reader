import mongoose from 'mongoose'

const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const Chapter = new mongoose.Schema({
  chapters: { type: Array },
  novel: { type: ObjectId, ref: 'novel'},
})

Chapter.statics = {
  getTitles: function (id){
    return this
      .find({novel: id})
      .exec()
  },
  getContent: function (id){
    return this
      .findById(id)
      .populate('novel',['name', 'url'])
      .exec()
  },
  findByNumber: function (id, num) {
    return this
      .findOne({number: num, novel: id})
      .exec()
  },
  getDirectory: function (options) {
    return this
      .find(options.where, options.attributes)
      .sort({number: options.order})
      .limit()
      .exec()
  }
}

export default mongoose.model('chapter', Chapter)
