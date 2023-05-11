import mongoose from 'mongoose'

// mongoose schema defines what each post should have
const postSchema = mongoose.Schema({
  title : String,
  message: String,
  creator: String,
  name: String,
  tags: [String],
  selectedFile: String,
  likes: {
    type: [String],
    default: []
  },
  createdAt: {
    type: Date,
    default: new Date()
  }
})
//turn the schema into a model
const PostMessage = mongoose.model('PostMessage', postSchema);

export default PostMessage;