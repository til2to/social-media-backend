import express from 'express'

import auth from '../middleware/auth.js';
import { getPost, getPosts, getPostsBySearch, createPost, updatePost, deletePost, likePost } from '../controllers/posts.js';

const router = express.Router();

//get posts
router.get('/', getPosts)
// get posts by search
router.get('/search', getPostsBySearch);
//create post
router.post('/', auth, createPost)
// get post
router.get('/:id', getPost);
//update post
router.patch('/:id', auth, updatePost)
//delete post
router.delete('/:id', auth, deletePost)
// update likes of a post
router.patch('/:id/likePost', auth, likePost)

export default router; 