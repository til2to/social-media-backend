import express from 'express';

import { signin, signup, } from '../controllers/user.js'
import auth from '../middleware/auth.js'

const router = express.Router()

// post user
router.post('/signin', signin)
//createPost
router.post('/signup', signup)

export default router; 