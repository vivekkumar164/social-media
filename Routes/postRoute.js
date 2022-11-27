import express from "express";
import { createPost, deletePost, getPost, getTimeLinePosts, likeDislikePost, updatePost } from "../Controllers/postController.js";

const router = express.Router();


 router.post('/',createPost);
 router.get('/:id',getPost);
 router.put('/:id',updatePost);
 router.delete('/:id',deletePost);
 router.put('/:id/likedislike',likeDislikePost);
 router.get('/:id/timeline',getTimeLinePosts);

export default router;