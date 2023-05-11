import mongoose from 'mongoose'

// define what each user should have
const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, requited: true },
  id: { type: String }
})
//turn the schema into a model
export default mongoose.model('User', userSchema);
