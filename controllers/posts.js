import mongoose from 'mongoose'
import PostMessage from '../models/postMessage.js'

//get all posts
export const getPosts = async (req, res) => {
  try{
    const postMessages = await PostMessage.find()
    res.status(200).json(postMessages)
  } 
  catch(error){
    res.status(404).json({ message: error.message })
  }
}

//add a post
export const createPost = async (req, res) => {
  const post = req.body
  const newPost = new PostMessage({ ...post, creator: req.userId, createdAt: new Date().toISOString() });
  try{
    await newPost.save()
    res.status(201).json(newPost)
  }
  catch(error){
    res.status(500).json({ message: error.message });
  }
}

// update a post
export const updatePost = async (req, res) => {
  try {
    const { id: _id } = req.params;
    const post = req.body
    if(!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send("No post with that id")
    const updatedPost = await PostMessage.findByIdAndUpdate(_id, post, {new: true});
    const response = {
      message: "Post successfully updated",
      post: updatedPost 
    }
    res.status(200).json(response);
  } 
  catch (error) {
    res.status(500).json({message: error.message})
  }
}

// delete a post
export const deletePost = async (req, res) => {
  try {
    const { id: _id } = req.params
    if(!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send("in valid request")
    await PostMessage.findByIdAndRemove(_id);
    res.json({message: "Post deleted successfully"})
  } catch (error) {
    console.log(error)
  }
}

// handle post likes
export const likePost = async (req, res) => {
  try {
    const { id: _id } = req.params;
    if(!req.userId) return res.json({ message: "unauthenticated"})
    // check if the post exist
    if(!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send("in valid request")
    // get the post since it exist
    const post = await PostMessage.findById(_id);

    const index = post.likes.findIndex((id) => id === String(req.userId));
    if(index === -1){
      // like the post
      post.likes.push(req.userId)
    }else {
      // dislike or remove the id from the like array
      post.likes = post.likes.filter((id) => id !== String(req.userId))
    }
    // update the post
    const updatedLikes = await PostMessage.findByIdAndUpdate(_id, post, {new: true});
    res.json(updatedLikes)
  } catch (error) {
    console.log(error);
  }
}