import mongoose from 'mongoose';
import PostMessage from '../models/postMessage.js';

// get post
export const getPost = async (req, res) => {
  const { id } = req.params;
  try{
    // if(!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send("No post with that id");
     const post = await PostMessage.findById(id);
     res.status(200).json(post);
  } 
  catch(error){
    res.status(404).json({ message: error.message })
  }
}
//get all posts
export const getPosts = async (req, res) => {
  const { page } = req.query
  try{
    //the maximum number of posts/documents to retrieve
    const displayLimit = 5
    // number of documents to skip before retrieving the remaining posts.
    const startIndex = (Number(page) -1) * displayLimit
    const totalPosts = await PostMessage.countDocuments({});
    // sort base on the latest post and limit the number of results given
    const posts = await PostMessage.find().sort({ _id: -1 }).limit(displayLimit).skip(startIndex)

    res.status(200).json({ data: posts, currentPage: Number(page), totalPages: Math.ceil(totalPosts/displayLimit) })
  } 
  catch(error){
    res.status(404).json({ message: error.message })
  }
}
// search and get posts // 'i' stands for ignore case
export const getPostsBySearch = async (req, res) => {
  const { searchQuery, tags } = req.query;
  try {
    // convert the query into reqExp to make it easier when searching through the DB
    const title = new RegExp(searchQuery, 'i'); 
    // find documents that match at least one of the conditions provided
    const posts = await PostMessage.find({ $or: [{ title }, { tags: { $in: tags.split(',') } }] });
    res.json({ data: posts });
  } catch (error) {
    res.status(404).json({ message: error.message });
    console.log(error);
  }
}
//add a post
export const createPost = async (req, res) => {
  const post = req.body
  try{
    const newPost = new PostMessage({ ...post, creator: req.userId, createdAt: new Date().toISOString() });
    await newPost.save()
    res.status(200).json(newPost)
  }
  catch(error){
    res.status(409).json({ message: error.message });
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
    if(!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send("invalid request")
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
    res.status(500).json({message: error.message});
  }
}