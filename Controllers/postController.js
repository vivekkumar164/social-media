import postModel from "../Models/postModel.js";
import mongoose from "mongoose";
import userModel from "../Models/userModel.js";


//create new post

export const createPost = async(req,res)=>{
    const newPost = new postModel(req.body);

    try {
        const post=await newPost.save();
        res.status(200).json(newPost);
    } catch (error) {
        res.status(500).json(error);
    }
}

//get a post
export const getPost = async(req,res)=>{
    const postId = req.params.id;
    try {
        const post = await postModel.findById(postId);
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json(error);
    }
}

//update post
export const updatePost = async(req,res)=>{
    const postId = req.params.id;
    const{userId} = req.body;
    try {
        const post = await postModel.findById(postId);
        if(post.userId === userId){
           await post.updateOne({$set : req.body}, { new: true })
           const updatedPost = await postModel.findById(postId);
            res.status(200).json(updatedPost);
        }
       else  res.status(403).json("Action forbidden!!");
    } catch (error) {
        res.status(500).json(error);
    }
}

//delete post

export const deletePost = async(req,res)=>{
    const postId = req.params.id;
    const{userId} = req.body;
    try {
        const post = await postModel.findById(postId);
        if(post.userId === userId){
           await post.deleteOne();
            res.status(200).json("Post deleted successfully...");
        }
       else  res.status(403).json("Action forbidden!!");
    } catch (error) {
        res.status(500).json(error);
    }
}

//like and dislike of a post

export const likeDislikePost = async(req,res)=>{
    const postId = req.params.id;
    const{userId} = req.body;
    try {
        const post = await postModel.findById(postId);
        if(!post.likes.includes(userId)){
            await post.updateOne({$push : {likes:userId}});
            res.status(200).json("Post Liked successfully...");
        }
       else {
        await post.updateOne({$pull : {likes:userId}});
        res.status(200).json("Post DisLiked successfully...");
       } 
    } catch (error) {
        res.status(500).json(error);
    }
}

//get timeline post

export const getTimeLinePosts = async(req,res) =>{
    const userId = req.params.id;

    try {
        const currentUserPosts = await postModel.find({userId : userId});
        const followingPosts = await userModel.aggregate([
            {
                $match: {
                    _id : new mongoose.Types.ObjectId(userId)
                }
                //this query will return a single document from usermodel from given id
            },
            {
                $lookup:{
                    from: "posts",
                    localField:"following",
                    foreignField:"userId",
                    as: "followingPosts"
                }
            },
            {
                $project:{
                    followingPosts : 1,
                    _id: 0
                }
            }
        ])
        res.status(200)
        .json(currentUserPosts.concat(...followingPosts[0].followingPosts)
        .sort((a,b)=>{
            return b.createdAt - a.createdAt
        })
        );
    } catch (error) {
        res.status(500).json(error);
    }
}


