import userModel from "../Models/userModel.js";
import bcrypt from 'bcrypt';

//get a user

export const getUser = async (req, res) => {
    const id = req.params.id;
    try {
        const user = await userModel.findById(id);
        const { password, ...otherDetails } = user._doc
        if (user) {
            res.status(200).json(otherDetails);
        }
        else {
            res.status(404).json({ message: 'user not found.' })
        }
    } catch (error) {
        res.status(500).json(error.message);
    }

}

//update a user

export const updateUser = async (req, res) => {
    const id = req.params.id;
    const { currentUserId, currentUserAdminStatus, password } = req.body;
    if (id === currentUserId || currentUserAdminStatus) {
        try {
            if (password) {
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(password, salt);
            }
            const user = await userModel.findByIdAndUpdate(id, req.body, { new: true });
            res.status(200).json(user);
        } catch (error) {
            res.status(500).json(error.message);
        }
    }
    else {
        res.status(403).json("Access Denied! you can only update your own profile.")
    }
}

//delete user

export const deleteUser = async (req, res) => {
    let id = req.params.id;
    const { currentUserId, currentUserAdminStatus } = req.body;
    if (id === currentUserId || currentUserAdminStatus) {
        try {
            await userModel.findByIdAndDelete(id);
            res.status(200).json('User deleted successfully')
        } catch (error) {
            res.status(500).json(error);
        }
    } else {
        res.status(403).json("Access Denied! you can only delete your own profile.")
    }

}

//follow a user
export const followUser = async (req,res)=>{
    let id  = req.params.id;
    const {currentUserId} = req.body;
    if(currentUserId == id){
        res.status(403).json("Action Forbidden!");
    }
    else{
        try {
            const followUser = await userModel.findById(id);
            const followingUser = await userModel.findById(currentUserId);
            if(!followUser.followers.includes(currentUserId)){
                 await followUser.updateOne({$push :    {followers : currentUserId}});
                 await followingUser.updateOne({$push: {following : id}});
                 res.status(200).json("User followed!")
            }else{
                res.status(403).json("User is  already followed by you!")
            }
        } catch (error) {
            es.status(500).json(error);
        }
    }
}

//unfollow a user
export const unFollowUser = async (req,res)=>{
    let id  = req.params.id;
    const {currentUserId} = req.body;
    if(currentUserId == id){
        res.status(403).json("Action Forbidden!");
    }
    else{
        try {
            const followUser = await userModel.findById(id);
            const followingUser = await userModel.findById(currentUserId);
            if(followUser.followers.includes(currentUserId)){
                 await followUser.updateOne({$pull :    {followers : currentUserId}});
                 await followingUser.updateOne({$pull: {following : id}});
                 res.status(200).json("User unFollowed!")
            }else{
                res.status(403).json("User is  not followed by you any more!")
            }
        } catch (error) {
            es.status(500).json(error);
        }
    }
}