import express from 'express'

import auth from '../middleware/auth.js'
import { getPosts, createPost,  updatePost, deletePost, likePost} from '../controllers/posts.js'

const router = express.Router()

//getPosts
router.get('/', getPosts)
//createPost
router.post('/', auth, createPost)
//updatePost
router.patch('/:id', auth, updatePost)
//deletePost
router.delete('/:id', auth, deletePost)
// update likes of a post
router.patch('/:id/likePost', auth, likePost)

export default router; 